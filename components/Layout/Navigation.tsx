import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";

import styles from "@/styles/layout/navigation.module.scss";
import useDisableBodyScroll from "@/hooks/disable-body-scroll";
import { HierarchicalMenu } from "@/types/menu";
import Button from "../Components/Button";
import Dropdown from "../Components/Dropdown";
import Accordion from "../Components/Accordion";
import { PartialsContext } from "@/contexts/partials";
import { PartialsData } from "@/types/partials";

const Navigation = ({ menu }: { menu: HierarchicalMenu }) => {
  const router = useRouter();
  const partials = useContext(PartialsContext) as PartialsData;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollTopPosition, setScrollTopPosition] = useState(0);
  const [currentPath, setCurrentPath] = useState(`${router.asPath}/`);
  const navbarRef = useRef<any>();
  const dropdownsRef = useRef<any[]>([]);

  useDisableBodyScroll(isMenuOpen);

  useEffect(() => {
    setCurrentPath(`${router.asPath}/`);

    const handleScroll = () => {
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      if (navbarRef.current) {
        if (
          currentScrollPosition >= scrollTopPosition &&
          scrollTopPosition > 100
        ) {
          if (!!dropdownsRef.current.length) {
            dropdownsRef.current.forEach((dropdown) => dropdown.close());
          }

          navbarRef.current.classList.add(styles["scrolled"]);
        } else {
          navbarRef.current.classList.remove(styles["scrolled"]);
        }
      }

      setScrollTopPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router.asPath, scrollTopPosition]);

  return (
    <nav className={styles["l-navbar-container"]}>
      <div
        ref={navbarRef}
        className={`${styles["l-navbar"]} ${styles["l-navbar--reveal"]} ${styles["mobile-no-animation"]}`}
      >
        {partials?.navigation?.nav_logo && (
          <Link
            href="/"
            title="Web Performance City"
            className={styles["l-navbar__logo-wrapper"]}
          >
            <Image
              src="/logo.png"
              width={120}
              height={60}
              alt="Web Performance City"
            />
          </Link>
        )}

        <div className={styles["l-navbar__inner"]}>
          <ul className={styles["menu"]}>
            {!!menu.length &&
              menu.map((item, index) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <li key={item.key}>
                      <Dropdown
                        ref={(ref) => (dropdownsRef.current[index] = ref)}
                        trigger={
                          <button type="button">
                            <span>{item.label}</span>
                            <MdChevronRight size={20} />
                          </button>
                        }
                        triggerClassName={`${styles["menu__link"]} ${styles["menu__link--trigger"]}`}
                        triggerClassNameOpen={styles["open"]}
                      >
                        <ul className={styles["dropdown"]}>
                          {item.children.map((child) => {
                            return (
                              <li
                                key={child.key}
                                className={styles["dropdown__item"]}
                              >
                                <Link
                                  className={
                                    child.cssClasses
                                      ? `${child.cssClasses} ${styles["dropdown__link"]}`
                                      : `${styles["dropdown__link"]}`
                                  }
                                  href={child.path}
                                  title={child.title || child.label}
                                  target={child.target || ""}
                                  onClick={() =>
                                    dropdownsRef.current[index].close()
                                  }
                                >
                                  <span className={styles["dropdown__label"]}>
                                    {child.label}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </Dropdown>
                    </li>
                  );
                } else {
                  return (
                    <li key={item.key} className={styles["menu__item"]}>
                      <Link
                        className={`
                        ${
                          item.cssClasses
                            ? `${styles["menu__link"]} ${item.cssClasses}`
                            : styles["menu__link"]
                        }
                        ${item.path === currentPath ? styles["active"] : ""}
                      `}
                        href={item.path}
                        title={item.title || item.label}
                        target={item.target || ""}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
              })}
          </ul>

          {partials?.navigation?.nav_btn_text &&
            partials?.navigation?.nav_btn_url && (
              <Button
                className="ml-4"
                component={Link}
                href={partials.navigation.nav_btn_url}
                title={partials.navigation.nav_btn_text}
                size="small"
                text={partials.navigation.nav_btn_text}
                animationDisabled
              ></Button>
            )}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className={`${styles["burger"]} ${isMenuOpen ? styles["open"] : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={styles["burger__box"]}>
            <span className={styles["burger__inner"]}></span>
          </span>
        </button>
      </div>

      <div
        className={`${styles["l-menu-wrapper"]} ${
          isMenuOpen ? styles["open"] : ""
        }`}
      >
        <div className={styles["l-menu"]}>
          <div className={styles["circle"]}></div>

          <ul className={styles["menu-mobile"]}>
            {!!menu.length &&
              menu.map((item) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <li key={item.key} className={styles["menu-mobile__item"]}>
                      <Accordion
                        trigger={
                          <button type="button">
                            <span>{item.label}</span>
                            <MdChevronRight size={20} />
                          </button>
                        }
                        triggerClassName={`${styles["menu-mobile__link"]} ${styles["menu-mobile__link--trigger"]}`}
                        accordionClassName={styles["menu-mobile__accordion"]}
                        accordionClassNameOpen={styles["open"]}
                      >
                        <ul className={styles["accordion"]}>
                          {item.children.map((child) => {
                            return (
                              <li key={child.key}>
                                <Link
                                  className={
                                    child.cssClasses
                                      ? `${child.cssClasses} ${styles["accordion__link"]}`
                                      : `${styles["accordion__link"]}`
                                  }
                                  href={child.path}
                                  title={child.title || child.label}
                                  target={child.target || ""}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </Accordion>
                    </li>
                  );
                } else {
                  return (
                    <li key={item.key} className={styles["menu-mobile__item"]}>
                      <Link
                        className={`
                        ${
                          item.cssClasses
                            ? `${styles["menu-mobile__link"]} ${item.cssClasses}`
                            : styles["menu-mobile__link"]
                        }
                        ${item.path === currentPath ? styles["active"] : ""}
                      `}
                        href={item.path}
                        title={item.title || item.label}
                        target={item.target || ""}
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
              })}
          </ul>
        </div>

        <div className="absolute w-full bottom-0 bg-black flex mt-auto py-20">
          <div className={styles["dots"]}></div>

          {partials?.navigation?.nav_btn_text &&
            partials?.navigation?.nav_btn_url && (
              <div className="w-full mx-6">
                <Button
                  className="relative z-[1]"
                  component={Link}
                  href={partials.navigation.nav_btn_url}
                  title={partials.navigation.nav_btn_text}
                  fullwidth={true}
                  hoverEffect={false}
                  text={partials.navigation.nav_btn_text}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  animationDisabled
                ></Button>
                <div className="absolute h-[1px] w-[100vw] bg-yellow top-1/2 left-0"></div>
              </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
