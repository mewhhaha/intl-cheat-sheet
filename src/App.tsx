import { useEffect, useRef, useState } from "react";
import { languages } from "./languages";
import cx from "clsx";
import { IconCopy } from "./icons/IconCopy";

const lengths = ["short", "medium", "long", "full"] as const;

const formats = lengths.flatMap((ds) => {
  return lengths.map((ts) => {
    return {
      dateStyle: ts,
      timeStyle: ds,
    };
  });
});

const languageSet = new Set(languages);
const date = new Date();

function App() {
  const [sticky, setSticky] = useState(false);

  const [locale, setLocale] = useState("en-GB");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const callback = () => {
      window.requestAnimationFrame(() => {
        setSticky(window.scrollY > 128);
      });
    };
    window.addEventListener("scroll", callback);

    return () => {
      window.removeEventListener("scroll", callback);
    };
  });

  return (
    <div className="relative">
      <h1 className="text-6xl font-bold text-center mt-16" aria-hidden={sticky}>
        Intl API Cheat Sheet
      </h1>
      <header
        className={cx("sticky flex top-0 mx-auto bg-white z-10 pb-4", {
          "shadow-md": sticky,
        })}
      >
        <div
          className={cx("absolute bottom-0 w-full transition-all ease-in-out", {
            "bg-black h-px scale-x-100 opacity-100": sticky,
            "rounded-b-full bg-white scale-x-0 opacity-0": !sticky,
          })}
        />
        {sticky && (
          <h1 className="font-bold absolute left-2 top-2">
            Intl API Cheat sheet
          </h1>
        )}
        <div className="relative pt-4 mx-auto bg-white">
          <label className="block absolute top-1 px-1 text-black  left-3 bg-white">
            Locale
          </label>
          <input
            className={cx(
              "px-4 pb-2 pt-3 ring text-gray-600 focus:text-black border-black border-2 rounded-md width-full",
              languageSet.has(locale) ? "ring-blue-600" : "ring-red-600"
            )}
            type="text"
            defaultValue="en-GB"
            onChange={(e) => {
              setLocale(e.target.value);
            }}
            list="codes"
          />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 flex flex-col my-16">
        <datalist id="codes">
          {languages.map((language) => {
            return (
              <option key={language} value={language}>
                {language}
              </option>
            );
          })}
        </datalist>
        <ul className="flex flex-col items-center gap-10">
          {formats.map((format) => {
            const label = `${format.dateStyle}, ${format.timeStyle}`;
            const json = JSON.stringify(format);
            return (
              <li
                key={label}
                className="max-w-xl group relative border rounded-md p-4 w-full"
              >
                <label className="px-4">{label}</label>
                <div className="text-2xl px-4 py-1">
                  {languageSet.has(locale) ? (
                    <p>{date.toLocaleString(locale, format)}</p>
                  ) : (
                    <p>{date.toISOString()}</p>
                  )}
                </div>
                <div
                  className="absolute hidden group-hover:flex flex-col top-0 bottom-0 left-0 right-0
                group-hover:cursor-copy"
                >
                  <button
                    onClick={() => {
                      setCopied(label);
                      navigator.clipboard.writeText(json);
                    }}
                    className="w-full h-full active:scale-95"
                    onMouseLeave={() => {
                      setCopied("");
                    }}
                  >
                    <div className="opacity-50 h-full">
                      <pre className="bg-gray-400 w-full h-full text-start group-hover:bg-black rounded-sm text-white">
                        {json}
                      </pre>
                      <div className="right-2 top-2 text-transparent group-hover:text-white absolute">
                        <IconCopy />
                      </div>
                    </div>
                    <div
                      className={cx({
                        "absolute font-bold inset-0 text-4xl pointer-events-none bg-gray-500/95 group-hover:text-white flex justify-center items-center":
                          label === copied,
                        hidden: label !== copied,
                      })}
                    >
                      copied
                    </div>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export default App;
