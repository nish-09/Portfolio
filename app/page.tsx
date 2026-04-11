import ScrollyCanvas from "./components/ScrollyCanvas";
import Overlay from "./components/Overlay";
import Projects from "./components/Projects";
import Ballpit from "./components/Ballpit";
import ConnectSection from "./components/ConnectSection";
import AboutMe from "./components/AboutMe";
import BackgroundParticles from "./components/BackgroundParticles";
import { StoryBlock, StorySection } from "./components/StorySection";

export default function Home() {
  return (
    <main id="home" className="min-h-screen min-h-[100dvh] w-full min-w-0 bg-[#101010] text-[#fcfcfc] relative overflow-x-clip">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <BackgroundParticles />
      </div>

      <div className="relative z-10 w-full min-w-0">
        <StoryBlock className="relative w-full min-w-0 overflow-x-clip">
          <ScrollyCanvas />
          <Overlay />
        </StoryBlock>

        <AboutMe />

        <Projects />

        <StorySection
          id="skills"
          className="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden relative w-full min-w-0 px-3 sm:px-4"
        >
          <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8 md:mb-10 text-center z-10 pointer-events-none relative">
            <h2 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter text-white drop-shadow-md">
              Skills
            </h2>
            <p className="text-white/60 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg px-2">
              Hover or drag to interact with my technology stack
            </p>
          </div>
          
          <div className="w-full min-w-0 max-w-[100vw] h-[min(48dvh,480px)] min-h-[240px] sm:min-h-[320px] sm:h-[min(52dvh,520px)] md:h-[70vh] md:min-h-[520px] relative z-10 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
            <Ballpit
              count={15}
              minSize={0.8}
              maxSize={1.5}
              size0={1.5}
              gravity={0}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={false}
              colors={["#ff0080", "#7928ca", "#0070f3", "#38bdf8", "#4ade80", "#f59e0b"]}
              texts={['C', 'Git', 'GitHub', 'VS Code', 'Canva', 'JavaScript', 'HTML5', 'CSS', 'Tailwind CSS', 'React.js', 'MySQL', 'Python', 'Next.js', 'Figma']}
              textColors={['#A8B9CC', '#F05032', '#ffffff', '#007ACC', '#00C4CC', '#F7DF1E', '#E34F26', '#1572B6', '#38B2AC', '#61DAFB', '#E48E00', '#FFD43B', '#ffffff', '#F24E1E']}
            />
          </div>
        </StorySection>

        <ConnectSection />
      </div>
    </main>
  );
}
