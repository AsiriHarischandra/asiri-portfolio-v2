import Navbar     from '@/components/layout/Navbar';
import Hero       from '@/components/sections/Hero';
import About      from '@/components/sections/About';
import Education  from '@/components/sections/Education';
import Projects   from '@/components/sections/Projects';
import Updates    from '@/components/sections/Updates';
import TechStack  from '@/components/sections/TechStack';
import Blog       from '@/components/sections/Blog';
import Contact    from '@/components/sections/Contact';
import Footer     from '@/components/layout/Footer';

import { getProjects, getUpdates, getBlogPosts, getSettings, serializeMany, serialize } from '@/lib/data';

export const revalidate = 60;

export default async function Home() {
  const [projects, updates, posts, settings] = await Promise.all([
    getProjects(),
    getUpdates(),
    getBlogPosts(),
    getSettings(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero settings={serialize(settings)} updates={serializeMany(updates)} />
      <About settings={serialize(settings)} />
      <Education />
      <Projects projects={serializeMany(projects)} />
      <Updates updates={serializeMany(updates)} />
      <TechStack />
      <Blog posts={serializeMany(posts)} />
      <Contact />
      <Footer settings={serialize(settings)} />
    </main>
  );
}
