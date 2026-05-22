import LogoLoop from "./LogoLoop";
import EnquirySection from "./EnquirySection";
import { StorySection } from "./StorySection";
import {
  SiGithub, SiWhatsapp, SiInstagram,
} from "react-icons/si";
import { FiMail, FiLinkedin, FiDownload } from "react-icons/fi";

const RESUME_HREF = "/resume.pdf";
const RESUME_FILENAME = "Nishit_Parikh_Resume.pdf";

const socialLinks = [
  { node: <SiGithub />, title: "GitHub", href: "https://github.com/nish-09", ariaLabel: "Visit my GitHub" },
  { node: <FiLinkedin />, title: "LinkedIn", href: "https://www.linkedin.com/in/nishit-parikh-390785329", ariaLabel: "Connect on LinkedIn" },
  {
    node: <SiWhatsapp />,
    title: "WhatsApp",
    href: "https://wa.me/917304019706",
    ariaLabel: "Chat with me on WhatsApp"
  },
  { node: <SiInstagram />, title: "Instagram", href: "https://instagram.com/nishitparikh_", ariaLabel: "Follow on Instagram" },
  { node: <FiMail />, title: "Email", href: "mailto: nishit.parikh9@gmail.com", ariaLabel: "Send me an email" },
];

const socialTicker = [...socialLinks, ...socialLinks];

export default function ConnectSection() {
  return (
    <StorySection id="contact" className="relative w-full min-w-0 max-w-[100vw] py-16 sm:py-20 md:py-28 bg-transparent overflow-hidden pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:px-4 md:px-0">

      <div className="relative z-10 w-full min-w-0 max-w-5xl mx-auto px-3 sm:px-6 text-center mb-10 sm:mb-16">
        <p className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase mb-3 sm:mb-4">
          Let&rsquo;s build something
        </p>
        <h2 className="text-[clamp(2.25rem,9vw,8rem)] md:text-8xl xl:text-9xl font-bold tracking-tighter text-white mb-4 sm:mb-6 leading-[1.05]">
          Connect with Me
        </h2>
        <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2">
          I&rsquo;m always open to new ideas, collaborations, or a simple hello.
          Reach out through any of the channels below.
        </p>
      </div>

      <div className="relative z-10 w-full min-w-0 mb-12 sm:mb-16">
        <EnquirySection />
      </div>

      <div className="relative z-10 mb-8 w-full min-w-0 px-2 sm:px-4">
        <p className="text-center text-xs sm:text-sm font-mono tracking-widest text-white/25 uppercase mb-4 sm:mb-5">
          Find me on
        </p>

        <div
          className="w-full max-w-[min(42rem,calc(100vw-1.25rem))] mx-auto overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 backdrop-blur-md h-14 sm:h-[70px]"
        >
          <LogoLoop
            logos={socialTicker}
            speed={80}
            direction="left"
            logoHeight={46}
            gap={52}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="transparent"
            ariaLabel="Social media links"
          />
        </div>
      </div>

      <div className="relative z-10 mt-10 sm:mt-16 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 w-full max-w-md sm:max-w-none mx-auto">
        <a
          href="mailto: nishit.parikh9@gmail.com"
          className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 text-white/80 text-sm sm:text-base font-medium hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 w-full sm:w-auto min-h-11 sm:min-h-0"
        >
          <FiMail className="text-lg sm:text-xl group-hover:rotate-12 transition-transform duration-300" />
          Say Hello
        </a>
        <a
          href={RESUME_HREF}
          download={RESUME_FILENAME}
          className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 text-white/80 text-sm sm:text-base font-medium hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 w-full sm:w-auto min-h-11 sm:min-h-0"
          aria-label="Download resume as PDF"
        >
          <FiDownload className="text-xl group-hover:translate-y-0.5 transition-transform duration-300" />
          Download resume
        </a>
      </div>
    </StorySection>
  );
}