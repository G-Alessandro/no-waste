import LinkedinSvg from "/assets/images/svg/linkedin.svg";
import GitHubSvg from "/assets/images/svg/github.svg";
import PersonalWebsiteSvg from "/assets/images/svg/personal-website.svg";
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
  return (
    <footer role="contentinfo">
      {footerLinks.map((link) => {
        return (
          <a
            href={link.imgHref}
            className={style.footerLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit my ${link.name}`}
          >
            <img src={link.imgSrc} />
            <p>{link.name}</p>
          </a>
        );
      })}
    </footer>
  );
}
