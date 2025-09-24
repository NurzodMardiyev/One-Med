import { ReactNode } from "react";

type props = {
  obj: {
    id: number;
    borderColor: string;
    color: string;
    title: string;
    howmuch: number;
    icon: ReactNode;
    iconStat?: ReactNode;
    desp: ReactNode;
    onClickBtn: (value: number | string) => void;
  };
};
export default function DashboardCard({ obj }: props) {
  return (
    <div
      className={`w-full h-[160px] md:h-auto border-s-3 ${obj.borderColor} border border-[#c8c8c8] rounded-md bg-white px-6 py-4`}
    >
      <div className="flex items-center justify-between mb-3 ">
        <p className="md:text-[14px] text-[12px]">{obj.title}</p>

        <div className="flex items-center gap-2 ">
          {obj?.icon}
          <button
            onClick={() => obj.onClickBtn(obj.id)}
            className="cursor-pointer"
          >
            {obj.iconStat}
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => obj.onClickBtn(obj.id)}
          className={`md:text-[24px] text-[18px] font-semibold cursor-pointer hover:text-[#2B7FFF] transition-all duration-250`}
        >
          {obj.howmuch}
        </button>
      </div>

      <div className="">{obj.desp}</div>
    </div>
  );
}
