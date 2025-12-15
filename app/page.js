import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center gap-6 md:gap-4 flex-col items-center text-white h-[44vh] px-5 md:px-0 ">
        <div className="font-bold text-4xl md:text-5xl flex justify-center items-center gap-3 text-center"> Buy Me a Chai <span><img src="/tea.gif" width={50} alt="a cup of tea" /></span></div>
        <p className="text-center">A crowdfunding platform for creators. Get funded by your fans and followers.</p>

        <div className=" flex gap-3">
          <Link href={"/login"}>
          <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5">Start Now</button>

          </Link>
          <Link href={"/about"}>
          <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5">Read more</button>
          </Link>

        </div>
      </div>
      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto pb-32 pt-14 px-3  md:px-0">
        <h2 className="text-3xl font-bold text-center mb-8">Your fans can buy you a chai</h2>
        <div className="flex justify-around p-4 gap-5">
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img className="bg-slate-400 rounded-full p-4 " width={92} src="/man.gif" alt="" />
            <p className="font-bold text-center">Fans want to help </p>
            <p className=" text-center">Your fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img className="bg-slate-400 rounded-full p-4 " width={92} src="/coin.gif" alt="" />
            <p className="font-bold text-center">Fans want to help </p>
            <p className=" text-center">Your fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img className="bg-slate-400 rounded-full p-4 " width={92} src="/crowdfunding.gif" alt="" />
            <p className="font-bold text-center">Fans want to help </p>
            <p className=" text-center">Your fans are available for you to help you</p>
          </div>
        </div>
      </div>


      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto pb-32 pt-10 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center mb-10">Learn more about us</h2>
        <iframe className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:h-[40vh] xl:h-[40vh]" src="https://www.youtube.com/embed/9YSDDjVzK8A?si=6o4WIaEc9mtfusYZ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </>
  );
}
