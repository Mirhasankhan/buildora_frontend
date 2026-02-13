import logo from "@/assets/banner.jpg";
import Container from "@/utils/Container";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="px-4 py-3 bg-gray-100">
      <Container>
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <Image className="h-8 w-8 rounded-full" src={logo} alt="Logo" height={40} width={40} />
            <h1 className="font-medium">Buildora</h1>
          </div>
          <div className="flex gap-6 text-lg font-medium">
            <Link href="/">Overview</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/workers">Workers</Link>     
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
