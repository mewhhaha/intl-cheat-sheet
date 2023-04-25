import { useEffect, useState } from "react";
import { languages } from "./languages";
import cx from "clsx";
import { IconCopy } from "./icons/IconCopy";

const lengths = ["short", "medium", "long", "full"] as const;

const dates = lengths.map((ds) => ({ dateStyle: ds, timeStyle: undefined }));
const times = lengths.map((ts) => ({ dateStyle: undefined, timeStyle: ts }));
const mixed = lengths.flatMap((ds) => {
  return lengths.map((ts) => {
    return {
      dateStyle: ts,
      timeStyle: ds,
    };
  });
});
const formats = [...dates, ...times, ...mixed];

const languageSet = new Set(languages);
const date = new Date();

function App() {
  const [sticky, setSticky] = useState(false);

  const [locale, setLocale] = useState("sv-SE");
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
      <h1 className="mt-16 text-center text-6xl font-bold" aria-hidden={sticky}>
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
          <h1 className="absolute left-2 top-2 font-bold">
            Intl API Cheat sheet
          </h1>
        )}
        <div className="relative mx-auto bg-white pt-4">
          <label className="absolute left-3 top-1 block bg-white  px-1 text-black">
            Locale
          </label>
          <input
            className={cx(
              "px-4 pb-2 pt-3 ring text-gray-600 focus:text-black border-black border-2 rounded-md width-full",
              languageSet.has(locale) ? "ring-blue-600" : "ring-red-600"
            )}
            type="text"
            defaultValue={locale}
            onChange={(e) => {
              setLocale(e.target.value);
            }}
            list="codes"
          />
        </div>
      </header>
      <main className="mx-auto my-16 flex max-w-3xl flex-col px-4">
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
            const label = [format.dateStyle, format.timeStyle]
              .filter(Boolean)
              .join(", ");

            const json = JSON.stringify(format);
            return (
              <li
                key={label}
                className="group relative w-full max-w-xl rounded-md border p-4"
              >
                <label className="px-4">{label}</label>
                <div className="px-4 py-1 text-2xl">
                  {languageSet.has(locale) ? (
                    <p>{date.toLocaleString(locale, format)}</p>
                  ) : (
                    <p>{date.toISOString()}</p>
                  )}
                </div>
                <div className="absolute inset-0 hidden flex-col group-hover:flex group-hover:cursor-copy">
                  <button
                    onClick={() => {
                      setCopied(label);
                      navigator.clipboard.writeText(json);
                    }}
                    className="h-full w-full active:scale-95"
                    onMouseLeave={() => {
                      setCopied("");
                    }}
                  >
                    <div className="h-full opacity-50">
                      <pre className="h-full w-full rounded-sm bg-gray-400 text-start text-white group-hover:bg-black">
                        {json}
                      </pre>
                      <div className="absolute right-2 top-2 text-transparent group-hover:text-white">
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
