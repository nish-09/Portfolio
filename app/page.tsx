import VideoIntro from "./components/VideoIntro";
import Projects from "./components/Projects";
import SkillsSection from "./components/SkillsSection";
import ConnectSection from "./components/ConnectSection";
import AboutMe from "./components/AboutMe";
import Galaxy from "./components/Galaxy";
import GitHubStats from "./components/GitHubStats";
import LeetCodeDossier from "./components/LeetCodeDossier";
import Achievements from "./components/Achievements";
import { StorySection } from "./components/StorySection";

const statsSectionClassName =
  "relative w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 lg:py-24 px-[max(1rem,env(safe-area-inset-left,0px))] overflow-hidden bg-transparent";

export default function Home() {
  return (
    <main id="home" className="min-h-screen min-h-[100dvh] w-full min-w-0 bg-black text-[#fcfcfc] relative overflow-x-clip">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={3}
          glowIntensity={0.2}
          saturation={1.0}
          hueShift={0}
          rotationSpeed={0.05}
          repulsionStrength={0.5}
          starSpeed={0.1}
          speed={0.1}
          transparent={true}
        />
      </div>

      <div className="relative z-10 w-full min-w-0">
        <VideoIntro />

        <AboutMe />

        <Projects />

        <SkillsSection />

        <StorySection id="stats" className={statsSectionClassName}>
          <GitHubStats />
          <LeetCodeDossier />
          <Achievements />
        </StorySection>

        <ConnectSection />
      </div>
    </main>
  );
}
