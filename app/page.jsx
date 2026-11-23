import Navbar     from '@/components/layout/Navbar';
import Hero       from '@/components/sections/Hero';
import About      from '@/components/sections/About';
import Education  from '@/components/sections/Education';
import Certifications from '@/components/sections/Certifications';
import Projects   from '@/components/sections/Projects';
import Updates    from '@/components/sections/Updates';
import TechStack  from '@/components/sections/TechStack';
import Blog       from '@/components/sections/Blog';
import Contact    from '@/components/sections/Contact';
import Footer     from '@/components/layout/Footer';

import { getProjects, getUpdates, getBlogPosts, getSettings, serializeMany, serialize } from '@/lib/data';

export const revalidate = 60;

export default async function Home() {
  // Without a DB (e.g. CI builds with no secrets) render with empty data /
  // section defaults instead of failing the build. In production the URI is
  // set, so real DB errors still surface.
  const [projects, updates, posts, settings] = process.env.MONGODB_URI
    ? await Promise.all([getProjects(), getUpdates(), getBlogPosts(), getSettings()])
    : [[], [], [], null];

  return (
    <main>
      <Navbar cvUrl={settings?.cvUrl || ''} />
      <Hero settings={serialize(settings)} updates={serializeMany(updates)} />
      <About settings={serialize(settings)} projectsCount={projects.length} />
      <Education settings={serialize(settings)} />
      <Certifications settings={serialize(settings)} />
      <Projects projects={serializeMany(projects)} />
      <Updates updates={serializeMany(updates)} />
      <TechStack settings={serialize(settings)} />
      <Blog posts={serializeMany(posts)} />
      <Contact />
      <Footer settings={serialize(settings)} />
    </main>
  );
}
