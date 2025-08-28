"use client";

import React, { useEffect } from "react";

const TabbedContent: React.FC = () => {
  useEffect(() => {
    const showTabContent = (hash: string) => {
      if (!hash) return;
      
      const targetElement = document.querySelector(`.tabbed-content${hash}`);
      if (targetElement) {
        document.querySelectorAll('.tabbed-content').forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        (targetElement as HTMLElement).style.display = 'block';
        requestAnimationFrame(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        });
      }
    };

    const handleHashChange = () => showTabContent(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    showTabContent(window.location.hash);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return <></>;
};

export default TabbedContent;