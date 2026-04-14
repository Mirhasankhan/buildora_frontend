"use client";

/* eslint-disable @next/next/no-img-element */

import { JWTDecode } from "@/utils/jwt";
import {
  Loader2,
  MessageSquareText,
  MessagesSquare,
  Send,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatTab = "member" | "group";

type ChatUser = {
  id?: string;
  userName?: string | null;
  profileImage?: string | null;
  isActive?: boolean;
};

type MemberConversation = {
  roomId: string;
  partner: ChatUser | null;
  lastMessage: {
    content: string | null;
    createdAt: string | null;
  } | null;
  unreadCount?: number;
};

type ProjectConversation = {
  projectRoomId: string | null;
  project: {
    id: string;
    projectName: string;
    projectImage?: string | null;
    isActive: boolean;
  };
  lastMessage: {
    content: string | null;
    createdAt: string | null;
  } | null;
  unreadCount?: number;
};

type MessageItem = {
  content?: string | null;
  createdAt?: string;
  senderId?: string;
  senderName?: string | null;
  senderProfileImage?: string | null;
  receiverId?: string;
  roomId?: string;
  projectRoomId?: string;
  fileUrl?: string[];
};

const getInitials = (value?: string | null) => {
  if (!value) return "U";
  const text = value.trim();
  if (!text) return "U";
  return text.charAt(0).toUpperCase();
};

const WS_URL = "ws://localhost:6800";

const resolveWsUrl = () => {
  const fromEnv = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.hostname}:6800`;
  }

  return WS_URL;
};

const formatTime = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getMessagePreview = (item?: MessageItem | null) => {
  if (!item) return "No message yet";
  if (item.content && item.content.trim()) return item.content;
  if ((item.fileUrl?.length ?? 0) > 0) return "sent file";
  return "No message yet";
};

const isSameMessage = (left: MessageItem, right: MessageItem) => {
  return (
    (left.createdAt || "") === (right.createdAt || "") &&
    (left.senderId || "") === (right.senderId || "") &&
    (left.content || "") === (right.content || "")
  );
};

const MessagePage = () => {
  const { token, decoded } = JWTDecode();
  const currentUserId = decoded?.id as string | undefined;
  const searchParams = useSearchParams();

  const initialTab = useMemo(() => {
    const value = searchParams.get("tab");
    return value === "group" ? "group" : "member";
  }, [searchParams]);

  const initialReceiverId = useMemo(
    () => searchParams.get("receiverId")?.trim() || "",
    [searchParams],
  );

  const initialReceiverName = useMemo(
    () => searchParams.get("receiverName")?.trim() || "",
    [searchParams],
  );

  const initialProjectId = useMemo(
    () => searchParams.get("projectId")?.trim() || "",
    [searchParams],
  );

  const [activeTab, setActiveTab] = useState<ChatTab>(initialTab);
  const [memberConversations, setMemberConversations] = useState<
    MemberConversation[]
  >([]);
  const [projectConversations, setProjectConversations] = useState<
    ProjectConversation[]
  >([]);
  const [activeMember, setActiveMember] = useState<MemberConversation | null>(
    null,
  );
  const [activeMemberRoomId, setActiveMemberRoomId] = useState<string | null>(
    null,
  );
  const [activeProject, setActiveProject] =
    useState<ProjectConversation | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedReceiverId, setSelectedReceiverId] =
    useState(initialReceiverId);
  const [selectedReceiverName, setSelectedReceiverName] =
    useState(initialReceiverName);
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "open" | "closed"
  >("connecting");
  const [socketError, setSocketError] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const activeMemberRef = useRef<MemberConversation | null>(null);
  const activeMemberRoomIdRef = useRef<string | null>(null);
  const activeProjectRef = useRef<ProjectConversation | null>(null);
  const activeTabRef = useRef<ChatTab>("member");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const autoProjectTargetRef = useRef<string | null>(null);

  useEffect(() => {
    activeMemberRef.current = activeMember;
  }, [activeMember]);

  useEffect(() => {
    activeMemberRoomIdRef.current = activeMemberRoomId;
  }, [activeMemberRoomId]);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (!token) {
      setSocketError("No auth token found. Please log in again.");
      setSocketStatus("closed");
      return;
    }

    let closedByCleanup = false;
    setSocketStatus("connecting");
    setSocketError("");

    const wsBaseUrl = resolveWsUrl();
    const ws = new WebSocket(
      `${wsBaseUrl}?x-token=${encodeURIComponent(token)}`,
    );
    socketRef.current = ws;

    ws.onopen = () => {
      if (socketRef.current !== ws || closedByCleanup) return;
      setSocketStatus("open");
      ws.send(JSON.stringify({ type: "member-conversation" }));
      ws.send(JSON.stringify({ type: "project-conversation" }));
    };

    ws.onmessage = (event) => {
      if (socketRef.current !== ws || closedByCleanup) return;
      try {
        const payload = JSON.parse(event.data as string);

        if (payload.type === "member-conversation") {
          setMemberConversations(
            (payload.conversations ?? []) as MemberConversation[],
          );
          return;
        }

        if (payload.type === "project-conversation") {
          setProjectConversations(
            (payload.conversations ?? []) as ProjectConversation[],
          );
          return;
        }

        if (payload.type === "past-messages") {
          setMessages((payload.messages ?? []) as MessageItem[]);
          if (payload.roomId) {
            setActiveMemberRoomId(payload.roomId as string);
          }
          if (payload.receiverId) {
            setSelectedReceiverId(payload.receiverId as string);
          }
          return;
        }

        if (payload.type === "project-history") {
          setMessages((payload.messages ?? []) as MessageItem[]);
          if (payload.projectRoomId && activeProjectRef.current) {
            setActiveProject({
              ...activeProjectRef.current,
              projectRoomId: payload.projectRoomId,
            });
          }
          return;
        }

        if (payload.type === "member-new-message") {
          const msg = payload.message as MessageItem;
          const activeRoomId = activeMemberRoomIdRef.current;
          if (
            activeTabRef.current === "member" &&
            activeRoomId &&
            payload.roomId === activeRoomId
          ) {
            setMessages((prev) => {
              if (prev.some((item) => isSameMessage(item, msg))) return prev;
              return [...prev, msg];
            });
          }
          return;
        }

        if (payload.type === "project-new-message") {
          const msg = payload.message as MessageItem;
          const activeProjectRoomId = activeProjectRef.current?.projectRoomId;
          if (
            activeTabRef.current === "group" &&
            activeProjectRoomId &&
            msg.projectRoomId === activeProjectRoomId
          ) {
            setMessages((prev) => {
              if (prev.some((item) => isSameMessage(item, msg))) return prev;
              return [...prev, msg];
            });
          }
          return;
        }

        if (payload.type === "error") {
          setSocketError(payload.message ?? "Socket error");
        }
      } catch {
        setSocketError("Failed to parse socket message");
      }
    };

    ws.onerror = () => {
      if (socketRef.current !== ws || closedByCleanup) return;
      setSocketError("Unable to connect socket server.");
    };

    ws.onclose = () => {
      if (socketRef.current !== ws || closedByCleanup) return;
      setSocketStatus("closed");
    };

    return () => {
      closedByCleanup = true;
      ws.close();
      if (socketRef.current === ws) {
        socketRef.current = null;
      }
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubscribeMember = (conversation: MemberConversation) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const receiverId = conversation.partner?.id;
    if (!receiverId) return;

    setActiveTab("member");
    setActiveMember(conversation);
    setActiveMemberRoomId(conversation.roomId);
    setActiveProject(null);
    setMessages([]);
    setSelectedReceiverId(receiverId);

    socketRef.current.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId,
      }),
    );
  };

  const handleSubscribeProject = (conversation: ProjectConversation) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    setActiveTab("group");
    setActiveProject(conversation);
    setActiveMember(null);
    setMessages([]);

    socketRef.current.send(
      JSON.stringify({
        type: "project-subscribe",
        projectId: conversation.project.id,
      }),
    );
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setSelectedReceiverId(initialReceiverId);
    setSelectedReceiverName(initialReceiverName);
    setActiveMemberRoomId(null);
  }, [initialReceiverId, initialReceiverName]);

  useEffect(() => {
    autoProjectTargetRef.current = null;
  }, [initialProjectId]);

  useEffect(() => {
    if (socketStatus !== "open") return;
    if (!initialReceiverId) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const targetConversation = memberConversations.find(
      (conversation) => conversation.partner?.id === initialReceiverId,
    );

    setActiveTab("member");
    setActiveProject(null);
    setMessages([]);
    setSelectedReceiverId(initialReceiverId);
    setSelectedReceiverName(initialReceiverName);

    if (targetConversation) {
      setActiveMember(targetConversation);
      setActiveMemberRoomId(targetConversation.roomId);
    } else {
      setActiveMember(null);
      setActiveMemberRoomId(null);
    }

    socket.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId: initialReceiverId,
      }),
    );
  }, [
    initialReceiverId,
    initialReceiverName,
    memberConversations,
    socketStatus,
  ]);

  useEffect(() => {
    if (activeTab !== "member") return;
    if (socketStatus !== "open") return;
    if (!selectedReceiverId) return;
    if (activeMemberRoomId) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId: selectedReceiverId,
      }),
    );
  }, [activeMemberRoomId, activeTab, selectedReceiverId, socketStatus]);

  useEffect(() => {
    if (socketStatus !== "open") return;
    if (!initialProjectId) return;
    if (autoProjectTargetRef.current === initialProjectId) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const targetConversation = projectConversations.find(
      (conversation) => conversation.project.id === initialProjectId,
    );

    setActiveTab("group");
    setActiveMember(null);
    setActiveMemberRoomId(null);
    setMessages([]);

    if (targetConversation) {
      setActiveProject(targetConversation);
    } else {
      setActiveProject(null);
    }

    socket.send(
      JSON.stringify({
        type: "project-subscribe",
        projectId: initialProjectId,
      }),
    );

    autoProjectTargetRef.current = initialProjectId;
  }, [initialProjectId, projectConversations, socketStatus]);

  const handleSendMessage = () => {
    const content = messageText.trim();
    if (!content) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (activeTab === "member") {
      const receiverId = activeMember?.partner?.id || selectedReceiverId.trim();
      if (!receiverId) return;
      if (!activeMemberRoomId) return;

      socketRef.current.send(
        JSON.stringify({
          type: "member-send-message",
          receiverId,
          content,
          fileUrl: [],
        }),
      );
    } else {
      const projectRoomId = activeProject?.projectRoomId;
      if (!projectRoomId) return;

      socketRef.current.send(
        JSON.stringify({
          type: "project-send-message",
          projectRoomId,
          content,
        }),
      );
    }

    setMessageText("");
  };

  const canSend = useMemo(() => {
    if (socketStatus !== "open") return false;
    if (messageText.trim().length === 0) return false;

    if (activeTab === "member") {
      return Boolean(
        (activeMember?.partner?.id || selectedReceiverId.trim()) &&
        activeMemberRoomId,
      );
    }

    return Boolean(activeProject?.projectRoomId);
  }, [
    activeMember?.partner?.id,
    activeProject?.projectRoomId,
    activeTab,
    messageText,
    selectedReceiverId,
    socketStatus,
    activeMemberRoomId,
  ]);

  const isSelectedReceiverInList = useMemo(() => {
    if (!selectedReceiverId) return true;
    return memberConversations.some(
      (conversation) => conversation.partner?.id === selectedReceiverId,
    );
  }, [memberConversations, selectedReceiverId]);

  const selectedMemberLabel =
    activeMember?.partner?.userName || selectedReceiverName || "Selected user";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">
            Member chat and project-based group chat.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
          Socket: {socketStatus}
        </div>
      </div>

      {socketError ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {socketError}
        </div>
      ) : null}

      <div className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/70 p-3 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.35)]">
          <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-sm backdrop-blur">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("member")}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === "member"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageSquareText size={16} />
                  Member Chat
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("group")}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === "group"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Users size={16} />
                  Project Chat
                </span>
              </button>
            </div>
          </div>

          {activeTab === "member" ? (
            <div className="space-y-3">
              <div className="px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Direct Conversations
                </p>
              </div>

              <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
                {selectedReceiverId && !isSelectedReceiverInList ? (
                  <button
                    type="button"
                    onClick={() => {
                      const socket = socketRef.current;
                      if (!socket || socket.readyState !== WebSocket.OPEN)
                        return;

                      setActiveTab("member");
                      setActiveProject(null);
                      setMessages([]);
                      setActiveMember(null);
                      setSelectedReceiverId(selectedReceiverId);

                      socket.send(
                        JSON.stringify({
                          type: "member-subscribe",
                          receiverId: selectedReceiverId,
                        }),
                      );
                    }}
                    className="w-full rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 to-white p-3.5 text-left shadow-sm transition hover:shadow"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-primary/20">
                          {getInitials(selectedMemberLabel)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-800">
                            {selectedMemberLabel}
                          </h3>
                          <p className="truncate text-[11px] text-slate-500">
                            Direct message room
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 truncate text-xs font-medium text-slate-500">
                      Ready to start conversation
                    </p>
                  </button>
                ) : null}

                {memberConversations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-500">
                    No member conversation found.
                  </div>
                ) : (
                  memberConversations.map((conversation) => {
                    const isActive =
                      activeMember?.roomId === conversation.roomId;
                    return (
                      <button
                        type="button"
                        key={conversation.roomId}
                        onClick={() => handleSubscribeMember(conversation)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          isActive
                            ? "border-primary/40 bg-primary/10 shadow-sm ring-1 ring-primary/15"
                            : "border-slate-200 bg-white/85 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={
                                conversation.partner?.profileImage ||
                                "https://ui-avatars.com/api/?name=User&background=e2e8f0&color=334155"
                              }
                              alt={conversation.partner?.userName || "User"}
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-slate-800">
                                {conversation.partner?.userName ||
                                  "Unknown user"}
                              </h3>
                              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                                {conversation.lastMessage?.content ||
                                  "No message yet"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {(conversation.unreadCount ?? 0) > 0 ? (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                {conversation.unreadCount}
                              </span>
                            ) : null}
                            {conversation.partner?.isActive ? (
                              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            ) : null}
                            {conversation.lastMessage?.createdAt ? (
                              <span className="text-[10px] font-medium text-slate-400">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Project Rooms
                </p>
              </div>

              <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
                {projectConversations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-500">
                    No accessible project group found.
                  </div>
                ) : (
                  projectConversations.map((conversation) => {
                    const isActive =
                      (activeProject?.projectRoomId &&
                        activeProject.projectRoomId ===
                          conversation.projectRoomId) ||
                      activeProject?.project.id === conversation.project.id;
                    return (
                      <button
                        type="button"
                        key={
                          conversation.projectRoomId ?? conversation.project.id
                        }
                        onClick={() => handleSubscribeProject(conversation)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          isActive
                            ? "border-primary/40 bg-primary/10 shadow-sm ring-1 ring-primary/15"
                            : "border-slate-200 bg-white/85 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={
                                conversation.project?.projectImage ||
                                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=60"
                              }
                              alt={
                                conversation.project?.projectName || "Project"
                              }
                              className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-slate-800">
                                {conversation.project?.projectName || "Project"}
                              </h3>
                              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                                {conversation.lastMessage?.content ||
                                  "No message yet"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {(conversation.unreadCount ?? 0) > 0 ? (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                {conversation.unreadCount}
                              </span>
                            ) : null}
                            {conversation.project?.isActive ? (
                              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            ) : null}
                            {conversation.lastMessage?.createdAt ? (
                              <span className="text-[10px] font-medium text-slate-400">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-700">
              {activeTab === "member"
                ? activeMember?.partner?.userName ||
                  "Select a member conversation"
                : activeProject?.project?.projectName ||
                  "Select a project group"}
            </h2>
          </div>

          <div className="h-[52vh] overflow-y-auto bg-slate-50/60 px-4 py-4">
            {socketStatus === "connecting" ? (
              <div className="flex h-full items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                <MessagesSquare className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((item, index) => {
                  const mine = currentUserId && item.senderId === currentUserId;
                  return (
                    <div
                      key={`${item.createdAt || "msg"}-${index}`}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      {!mine ? (
                        <img
                          src={
                            item.senderProfileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.senderName || "User",
                            )}&background=e2e8f0&color=334155`
                          }
                          alt={item.senderName || "User"}
                          className="mr-2 mt-1 h-8 w-8 rounded-full object-cover"
                        />
                      ) : null}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          mine
                            ? "bg-primary text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {!mine ? (
                          <p className="mb-1 text-[11px] font-medium text-slate-500">
                            {item.senderName || "User"}
                          </p>
                        ) : null}
                        <p>{getMessagePreview(item)}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            mine ? "text-white/70" : "text-slate-400"
                          }`}
                        >
                          {formatTime(item.createdAt)}
                        </p>
                      </div>
                      {mine ? (
                        <div className="ml-2 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                          {getInitials(decoded?.userName as string | undefined)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <input
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSendMessage();
                }}
                placeholder="Write a message"
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none ring-primary/20 focus:ring"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!canSend}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MessagePage;
