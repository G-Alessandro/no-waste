import { useEffect, useState } from "react";
import LinkedinSvg from "/assets/images/svg/footer/linkedin.svg";
import GitHubSvg from "/assets/images/svg/footer/github.svg";
import PersonalWebsiteSvg from "/assets/images/svg/footer/personal-website.svg";
import style from "./Footer.module.css";

const footerLinks = [
  {
    name: "GitHub",
    imgHref: "https://github.com/G-Alessandro/no-waste",
    imgSrc: GitHubSvg,
  },
  {
    name: "Linkedin",
    imgHref: "https://www.linkedin.com/in/alessandro-gallo-8b908028a/",
    imgSrc: LinkedinSvg,
  },
  {
    name: "Personal Website",
    imgHref: "https://effortless-pudding-215a08.netlify.app/",
    imgSrc: PersonalWebsiteSvg,
  },
];

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer role="contentinfo">
      {footerLinks.map((link) => {
        return (
          <a
            key={link.name}
            href={link.imgHref}
            className={style.footerLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit my ${link.name}`}
          >
            <img src={link.imgSrc} />
            {!isMobile && <p>{link.name}</p>}
          </a>
        );
      })}
    </footer>
  );
}
