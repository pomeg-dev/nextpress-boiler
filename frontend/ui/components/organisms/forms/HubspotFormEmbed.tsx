'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HubspotFormEmbedProps {
  formHtml: string;
  className?: string;
}

const HubspotFormEmbed: React.FC<HubspotFormEmbedProps> = ({ formHtml, className = 'w-full' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formHtml;
    const scripts = tempDiv.querySelectorAll('script');
    let hsScriptUrl: string = '';
    let formConfig: any = null;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('hsforms.net')) {
        hsScriptUrl = src;
      } else if (script.textContent?.includes('hbspt.forms.create')) {
        try {
          const configText = script.textContent.trim()
            .replace('hbspt.forms.create(', '')
            .replace(/\);?\s*$/, '');
          
          formConfig = Function(`return ${configText}`)();
        } catch (e) {
          console.error('Failed to parse HubSpot form config:', e);
        }
      }
    });
    
    if (hsScriptUrl && !document.querySelector(`script[src="${hsScriptUrl}"]`)) {
      const script = document.createElement('script');
      script.src = hsScriptUrl.startsWith('//') ? `https:${hsScriptUrl}` : hsScriptUrl;
      script.charset = 'utf-8';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
    
    if (formConfig) {
      containerRef.current.dataset.formConfig = JSON.stringify(formConfig);
    }
  }, [formHtml]);
  
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;
    if (typeof window.hbspt === 'undefined') {
      console.error('HubSpot forms library not loaded');
      return;
    }
    
    const formConfigStr = containerRef.current.dataset.formConfig;
    if (!formConfigStr) {
      console.error('No form configuration found');
      return;
    }
    
    try {
      const formConfig = JSON.parse(formConfigStr);
      const targetId = `hubspot-form-${Math.random().toString(36).substring(2, 9)}`;
      containerRef.current.id = targetId;
      
      const formEl = document.createElement('div');
      formEl.id = `${targetId}-inner`;
      containerRef.current.appendChild(formEl);
      
      window.hbspt.forms.create({
        ...formConfig,
        target: `#${formEl.id}`
      });
    } catch (e) {
      console.error('Failed to create HubSpot form:', e);
    }
  }, [isScriptLoaded]);
  
  return <div className={`hubspot-form-container ${className}`} ref={containerRef} />;
};

declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (config: any) => void;
      };
    };
  }
}

export default HubspotFormEmbed;