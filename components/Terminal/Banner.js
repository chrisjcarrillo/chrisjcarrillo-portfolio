import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { content, bannerFull, bannerShort } from '../../data/content';

// The static "identity" header of the terminal: ASCII name banner (responsive),
// tagline, and the social-icon row. Fades in as a unit (motion-safe only).
export default function Banner() {
  const c = content.contact;

  return (
    <div className="motion-safe:animate-fade-in-up">
      {/* Full name — desktop/tablet */}
      <pre
        aria-label={content.name}
        className="hidden md:block whitespace-pre overflow-x-auto font-bold leading-none text-[7px] lg:text-[9px]"
      >
        {bannerFull.replace(/^\n/, '')}
      </pre>

      {/* First name — mobile */}
      <pre
        aria-label={content.name}
        className="md:hidden whitespace-pre overflow-x-auto font-bold leading-none text-[10px]"
      >
        {bannerShort.replace(/^\n/, '')}
      </pre>

      <div className="mt-3 text-sm md:text-base lowercase">
        <span className="md:hidden font-bold">{content.name} — </span>
        {content.tagline.join(' ')}
      </div>

      <div className="flex gap-6 mt-4">
        <a href={c.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={['fab', 'linkedin-in']} size="lg" />
        </a>
        <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FontAwesomeIcon icon={['fab', 'instagram']} size="lg" />
        </a>
        <a href={c.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={['fab', 'github']} size="lg" />
        </a>
      </div>
    </div>
  );
}
