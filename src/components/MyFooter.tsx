"use client";

import { useTheme } from "next-themes";
import { Tooltip } from "@/components/ui/tooltip";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="w-full bg-mantle pl-12 py-4 z-40">
      <div className="z-40 grid grid-cols-2 items-center gap-3 md:flex md:flex-row md:items-center md:justify-around text-sm">
        <p className="text-subtext1 hover:cursor-pointer hidden md:block">
          {" "}
          2025 &copy; TIZMABEATS
        </p>
        <p className="text-subtext1 hover:cursor-pointer hover:text-subtext0 duration-300">
          Terms of Service
        </p>
        <p className="text-subtext1 hover:cursor-pointer hover:text-subtext0 duration-300 ">
          Privacy Policy
        </p>
        <p className="text-subtext1 hover:cursor-pointer hover:text-subtext0 duration-300">
          Legal
        </p>
        <Tooltip
          showArrow={false}
          content={theme === "mocha" ? "Light Theme" : "Dark Theme"}
          className="hidden sm:block z-50 bg-surface2 text-subtext1"
        >
          <label className="swap swap-rotate hover:scale-110 duration-300 hover:cursor-pointer mt-1">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              checked={theme === "mocha"}
              onChange={(e) => {
                const isChecked = e.target.checked;
                console.log(isChecked);
                theme === "latte" ? setTheme("mocha") : setTheme("latte");
              }}
            />

            {/* sun icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="swap-on size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>

            {/* moon icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="swap-off size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </label>
        </Tooltip>
        <p className="text-subtext1 hover:cursor-pointer md:hidden">
          {" "}
          2025 &copy; TIZMABEATS
        </p>
      </div>
    </footer>
  );
}
