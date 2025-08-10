import { useEffect, useState } from "react";

export interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  id?: string;
  fbclid?: string;
}

/**
 * Hook para capturar e gerenciar parâmetros UTM da URL
 */
export const useUtmParameters = () => {
  const [utmParams, setUtmParams] = useState<UtmParameters>({});
  const [domainBase, setDomainBase] = useState<string>("giselegalvao.com.br");

  useEffect(() => {
    // Carregar configuração de domínio do localStorage, se disponível
    const savedDomain = localStorage.getItem("domain_base");
    if (savedDomain) {
      setDomainBase(savedDomain);
    }

    // Captura parâmetros UTM ao carregar o componente
    const capturedParams = captureUtmParameters();
    setUtmParams(capturedParams);

    // Se tiver parâmetros UTM, salve no servidor para análises
    if (Object.keys(capturedParams).length > 0) {
      saveUtmToServer(capturedParams);
    }
  }, []);

  /**
   * Salva os parâmetros UTM no servidor para análise
   */
  const saveUtmToServer = async (params: UtmParameters) => {
    try {
      const response = await fetch("http://localhost:3001/api/utm-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utmSource: params.source,
          utmMedium: params.medium,
          utmCampaign: params.campaign,
          utmContent: params.content,
          utmTerm: params.term,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("UTM parameters saved successfully");
      } else {
        console.error("Error saving UTM parameters:", result.error);
      }
    } catch (error) {
      console.error("Error in saveUtmToServer:", error);
    }
  };

  /**
   * Captura parâmetros UTM da URL atual
   */
  const captureUtmParameters = (): UtmParameters => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams: UtmParameters = {};

      // Parâmetros UTM padrão
      if (urlParams.has("utm_source")) utmParams.source = urlParams.get("utm_source") || undefined;
      if (urlParams.has("utm_medium")) utmParams.medium = urlParams.get("utm_medium") || undefined;
      if (urlParams.has("utm_campaign"))
        utmParams.campaign = urlParams.get("utm_campaign") || undefined;
      if (urlParams.has("utm_content"))
        utmParams.content = urlParams.get("utm_content") || undefined;
      if (urlParams.has("utm_term")) utmParams.term = urlParams.get("utm_term") || undefined;
      if (urlParams.has("utm_id")) utmParams.id = urlParams.get("utm_id") || undefined;

      // Parâmetro específico do Facebook
      if (urlParams.has("fbclid")) utmParams.fbclid = urlParams.get("fbclid") || undefined;

      // Armazenar parâmetros UTM no localStorage para persistência
      if (Object.keys(utmParams).length > 0) {
        localStorage.setItem("utm_parameters", JSON.stringify(utmParams));
        console.log("UTM parameters captured:", utmParams);
      } else {
        // Tentar recuperar parâmetros do localStorage se não houver na URL
        const storedUtmParams = localStorage.getItem("utm_parameters");
        if (storedUtmParams) {
          return JSON.parse(storedUtmParams);
        }
      }

      return utmParams;
    } catch (error) {
      console.error("Error capturing UTM parameters:", error);
      return {};
    }
  };

  /**
   * Verifica se o tráfego veio de uma campanha específica
   */
  const isFromCampaign = (campaignName?: string): boolean => {
    if (!campaignName) return Object.keys(utmParams).length > 0;
    return utmParams.campaign === campaignName;
  };

  /**
   * Verifica se o tráfego veio de uma fonte específica
   */
  const isFromSource = (sourceName?: string): boolean => {
    if (!sourceName) return !!utmParams.source;
    return utmParams.source === sourceName;
  };

  /**
   * Obtém o valor de um parâmetro UTM específico
   */
  const getUtmParameter = (param: keyof UtmParameters): string | undefined => {
    return utmParams[param];
  };

  /**
   * Adiciona parâmetros UTM a uma URL
   */
  const addUtmToUrl = (url: string): string => {
    if (Object.keys(utmParams).length === 0) return url;

    try {
      const urlObj = new URL(url);
      if (utmParams.source) urlObj.searchParams.append("utm_source", utmParams.source);
      if (utmParams.medium) urlObj.searchParams.append("utm_medium", utmParams.medium);
      if (utmParams.campaign) urlObj.searchParams.append("utm_campaign", utmParams.campaign);
      if (utmParams.content) urlObj.searchParams.append("utm_content", utmParams.content);
      if (utmParams.term) urlObj.searchParams.append("utm_term", utmParams.term);
      if (utmParams.id) urlObj.searchParams.append("utm_id", utmParams.id);
      if (utmParams.fbclid) urlObj.searchParams.append("fbclid", utmParams.fbclid);

      return urlObj.toString();
    } catch (error) {
      console.error("Error adding UTM parameters to URL:", error);
      return url;
    }
  };

  /**
   * Configura o domínio base para uso nos links UTM
   */
  const setBaseDomain = (domain: string) => {
    setDomainBase(domain);
    localStorage.setItem("domain_base", domain);
  };

  /**
   * Gera links UTM completos para diferentes canais
   */
  const generateUtmLink = (
    path: string = "",
    source: string = "facebook",
    medium: string = "social",
    campaign: string = "brand",
    content?: string,
    term?: string
  ): string => {
    let baseUrl = `https://${domainBase}`;
    if (path && !path.startsWith("/")) {
      baseUrl += "/";
    }
    baseUrl += path;

    const url = new URL(baseUrl);
    url.searchParams.append("utm_source", source);
    url.searchParams.append("utm_medium", medium);
    url.searchParams.append("utm_campaign", campaign);
    if (content) url.searchParams.append("utm_content", content);
    if (term) url.searchParams.append("utm_term", term);

    return url.toString();
  };

  return {
    utmParams,
    captureUtmParameters,
    isFromCampaign,
    isFromSource,
    getUtmParameter,
    addUtmToUrl,
    domainBase,
    setBaseDomain,
    generateUtmLink,
  };
};
