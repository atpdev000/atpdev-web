"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus, Trash2, Eye, EyeOff, Pencil, Loader2, Github, Lock, Globe, Search, Camera, ImageOff, Upload, ExternalLink, Palette, Check, CheckCircle2, QrCode } from "lucide-react";
import { Project, GithubRepoSummary, slugify } from "@atpdev/database";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createProject, updateStatus, deleteProject, updateProjectAction, autofillProjectWithAI, getGithubRepos, captureScreenshot, uploadImageFile, uploadApkFile, uploadIpaFile, getApkSignedUploadUrlAction, getIpaSignedUploadUrlAction, suggestGradientColorsWithAI } from "./actions";
import { ProjectThemeStudio, type ProjectThemeConfig } from "./ProjectThemeStudio";

type UIBlock = { id: string; type: "h2" | "p" | "image"; content: string; alt?: string; url?: string; context?: string };

function parseMarkdownToBlocks(markdown: string): UIBlock[] {
  if (!markdown || !markdown.trim()) return [];

  if (markdown.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(markdown);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b: any, i: number) => ({
          id: b.id || String(i),
          type: b.type || "p",
          content: b.content || "",
          alt: b.alt || "",
          url: b.url || "",
          context: b.context || ""
        }));
      }
    } catch (e) {}
  }

  const blocks: UIBlock[] = [];
  let idCounter = Date.now();
  const rawSections = markdown.split(/\n\s*\n/);

  for (const section of rawSections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const imgMatch = trimmed.match(/^!\[([\s\S]*?)\]\(([\s\S]*?)\)$/);
    if (imgMatch) {
      blocks.push({
        id: String(idCounter++),
        type: "image",
        content: "",
        alt: imgMatch[1] || "Imagen del artículo",
        url: imgMatch[2] || "",
        context: imgMatch[1] || "Imagen del artículo"
      });
      continue;
    }

    if (trimmed.startsWith("##")) {
      blocks.push({
        id: String(idCounter++),
        type: "h2",
        content: trimmed.replace(/^#+\s*/, "")
      });
      continue;
    }

    const lines = trimmed.split("\n");
    let currentParagraphLines: string[] = [];

    for (const line of lines) {
      const lineTrimmed = line.trim();
      const lineImgMatch = lineTrimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (lineImgMatch) {
        if (currentParagraphLines.length > 0) {
          blocks.push({
            id: String(idCounter++),
            type: "p",
            content: currentParagraphLines.join("\n")
          });
          currentParagraphLines = [];
        }
        blocks.push({
          id: String(idCounter++),
          type: "image",
          content: "",
          alt: lineImgMatch[1] || "Imagen del artículo",
          url: lineImgMatch[2] || "",
          context: lineImgMatch[1] || "Imagen del artículo"
        });
      } else if (lineTrimmed.startsWith("##")) {
        if (currentParagraphLines.length > 0) {
          blocks.push({
            id: String(idCounter++),
            type: "p",
            content: currentParagraphLines.join("\n")
          });
          currentParagraphLines = [];
        }
        blocks.push({
          id: String(idCounter++),
          type: "h2",
          content: lineTrimmed.replace(/^#+\s*/, "")
        });
      } else {
        currentParagraphLines.push(line);
      }
    }

    if (currentParagraphLines.length > 0) {
      blocks.push({
        id: String(idCounter++),
        type: "p",
        content: currentParagraphLines.join("\n")
      });
    }
  }

  return blocks;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const editingProject = projectList.find(p => p.id === editingId) || null;

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = (currentStatus === 'Activo' || currentStatus === 'Público') ? 'Privado' : 'Activo';
    setProjectList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (editingId === id) {
      setStatus(newStatus);
    }
    await updateStatus(id, newStatus);
    router.refresh();
  };

  const handleDeleteProject = async (id: number, projTitle: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projTitle}"? Esta acción no se puede deshacer.`)) return;
    setProjectList(prev => prev.filter(p => p.id !== id));
    await deleteProject(id);
    router.refresh();
  };

  // Campos controlados para poder llenarlos con "Autocompletar desde GitHub"
  const [repoInput, setRepoInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [long_description, setLongDescription] = useState("");
  const [is_featured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<string>("Privado");
  const [stack, setStack] = useState("");
  const [category, setCategory] = useState("Android");
  const [slug, setSlug] = useState("");
  const [domainType, setDomainType] = useState<"subruta" | "subdominio" | "externa">("subruta");
  const [demolink, setDemolink] = useState("");
  const [playstore, setPlaystore] = useState("");
  const [appstore, setAppstore] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // screenshot capturado, viaja en input oculto "image"
  const [themeConfig, setThemeConfig] = useState<string>("");
  const [qrTheme, setQrTheme] = useState<string>("emerald");
  const [qrBadgeStyle, setQrBadgeStyle] = useState<string>("white");
  const [qrCardBg, setQrCardBg] = useState<string>("dark");
  const [qrCornerStyle, setQrCornerStyle] = useState<string>("rounded");
  const [qrOuterFrame, setQrOuterFrame] = useState<string>("neon");
  const [qrBorderStyle, setQrBorderStyle] = useState<string>("neon");
  const [qrTextTone, setQrTextTone] = useState<string>("auto");

  // Módulos Legales y Subpáginas Dinámicas
  const [hasPrivacy, setHasPrivacy] = useState(true);
  const [hasTerms, setHasTerms] = useState(true);
  const [hasCredits, setHasCredits] = useState(true);
  const [hasAi, setHasAi] = useState(true);
  const [hasAdmob, setHasAdmob] = useState(true);
  const [hasSourceCode, setHasSourceCode] = useState(true);
  
  // Estado para el editor de bloques (Pseudo-Block Editor)
  type UIBlock = { id: string; type: "h2" | "p" | "image"; content: string; alt?: string; url?: string; context?: string };
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [showGradientBuilderModal, setShowGradientBuilderModal] = useState(false);

  const [autofillState, setAutofillState] = useState<"idle" | "loading" | "error">("idle");
  const [autofillError, setAutofillError] = useState("");
  const [screenshotState, setScreenshotState] = useState<"idle" | "loading" | "error">("idle");
  const [screenshotError, setScreenshotError] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const [apkUploadState, setApkUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [apkUploadError, setApkUploadError] = useState("");
  const [apkUploadProgress, setApkUploadProgress] = useState(0);
  const [apkUploadDetails, setApkUploadDetails] = useState<{ name: string; size: string; loaded: string } | null>(null);

  const [ipaUploadState, setIpaUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [ipaUploadError, setIpaUploadError] = useState("");
  const [ipaUploadProgress, setIpaUploadProgress] = useState(0);
  const [ipaUploadDetails, setIpaUploadDetails] = useState<{ name: string; size: string; loaded: string } | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apkFileInputRef = useRef<HTMLInputElement>(null);
  const ipaFileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  
  // Editor Markdown Enriquecido
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inlineUploadState, setInlineUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [inlineUploadError, setInlineUploadError] = useState("");

  // Selector de repos tipo "Import Project" de Vercel
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState("");
  const [repos, setRepos] = useState<GithubRepoSummary[] | null>(null);
  const [repoSearch, setRepoSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sincroniza el formulario cuando empiezas a editar un proyecto existente
  useEffect(() => {
    setRepoInput(editingProject?.github_repo || "");
    setTitle(editingProject?.title || "");
    setDescription(editingProject?.description || "");
    setLongDescription(editingProject?.long_description || "");
    setIsFeatured(editingProject?.is_featured || false);
    setStatus(editingProject ? (editingProject.status === "Privado" ? "Privado" : "Activo") : "Privado");
    setStack(editingProject?.stack.join(", ") || "");
    setCategory(editingProject?.category || "Android");
    setSlug(editingProject?.slug || "");
    
    const rawLongDesc = editingProject?.long_description || editingProject?.description || "";
    setBlocks(parseMarkdownToBlocks(rawLongDesc));
    
    const rawDemo = editingProject?.demolink && editingProject.demolink !== "#" ? editingProject.demolink : "";
    const isSubrutaUrl = rawDemo.includes("/apps/") || (editingProject?.slug && rawDemo.includes(editingProject.slug));
    const demo = isSubrutaUrl ? "" : rawDemo;
    setDemolink(demo);
    setPlaystore(editingProject?.playstore || "");
    setAppstore((editingProject as any)?.appstore || "");
    setThemeConfig(editingProject?.theme_config || "");
    
    let currentQrTheme = "emerald";
    let currentQrBadgeStyle = "white";
    let currentQrCardBg = "dark";
    let currentQrCornerStyle = "rounded";
    let currentQrOuterFrame = "neon";
    let currentQrBorderStyle = "neon";
    let currentQrTextTone = "auto";
    if (editingProject?.theme_config) {
      try {
        const parsed = JSON.parse(editingProject.theme_config);
        if (parsed.qr) {
          if (parsed.qr.theme) currentQrTheme = parsed.qr.theme;
          if (parsed.qr.badgeStyle) currentQrBadgeStyle = parsed.qr.badgeStyle;
          if (parsed.qr.cardBg) currentQrCardBg = parsed.qr.cardBg;
          if (parsed.qr.cornerStyle) currentQrCornerStyle = parsed.qr.cornerStyle;
          if (parsed.qr.outerFrame) currentQrOuterFrame = parsed.qr.outerFrame;
          if (parsed.qr.qrBorder) currentQrBorderStyle = parsed.qr.qrBorder;
          if (parsed.qr.textTone) currentQrTextTone = parsed.qr.textTone;
        }
      } catch (e) {}
    }
    setQrTheme(currentQrTheme);
    setQrBadgeStyle(currentQrBadgeStyle);
    setQrCardBg(currentQrCardBg);
    setQrCornerStyle(currentQrCornerStyle);
    setQrOuterFrame(currentQrOuterFrame);
    setQrBorderStyle(currentQrBorderStyle);
    setQrTextTone(currentQrTextTone);
    
    if (editingProject?.legal_config) {
      try {
        const parsed = JSON.parse(editingProject.legal_config);
        setHasPrivacy(parsed.has_privacy ?? true);
        setHasTerms(parsed.has_terms ?? true);
        setHasCredits(parsed.has_credits ?? true);
        setHasAi(parsed.has_ai ?? true);
        setHasAdmob(parsed.has_admob ?? true);
        setHasSourceCode(parsed.has_source_code ?? true);
      } catch {
        setHasPrivacy(true); setHasTerms(true); setHasCredits(true); setHasAi(true); setHasAdmob(true); setHasSourceCode(true);
      }
    } else {
      setHasPrivacy(true); setHasTerms(true); setHasCredits(true); setHasAi(true); setHasAdmob(true); setHasSourceCode(true);
    }

    setDomainType(!demo ? "subruta" : demo.includes("play.google.com") ? "externa" : "subdominio");
    
    setUploadState("idle");
    setImagePreview(editingProject?.image || "");
    setAutofillState("idle");
    setAutofillError("");
    setScreenshotState("idle");
    setScreenshotError("");
    setUploadState("idle");
    setUploadError("");
    setSubmitState("idle");
    setSubmitError("");
    setInlineUploadState("idle");
    setInlineUploadError("");
  }, [editingId]);

  // Cierra el dropdown si haces clic afuera
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerOpen]);

  // Escuchar mensajes del Iframe de Gradient Builder
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'GRADIENT_GENERATED' && e.data?.payload) {
        setImagePreview(e.data.payload);
        setShowGradientBuilderModal(false);

        try {
          setUploadState("loading");
          const res = await fetch(e.data.payload);
          const blob = await res.blob();
          const file = new File([blob], `cover_${Date.now()}.png`, { type: "image/png" });
          const fd = new FormData();
          fd.set("file", file);
          const result = await uploadImageFile(fd);
          if (result && "imageUrl" in result && result.imageUrl) {
            setImagePreview(result.imageUrl);
          }
          setUploadState("idle");
        } catch (error) {
          console.error("Error uploading gradient", error);
          setUploadState("error");
          setUploadError("Error al subir la imagen autogenerada.");
        }
      }
      
      if (e.data?.type === 'REQUEST_AI_COLORS') {
        const result = await suggestGradientColorsWithAI(title, description);
        if (result && 'colors' in result && result.colors && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'APPLY_AI_COLORS', payload: result.colors }, '*');
        } else if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'APPLY_AI_COLORS_ERROR' }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [title, description]);

  const openPicker = async () => {
    setPickerOpen(true);
    if (repos) return; // ya cargados, no volvemos a pedir la lista
    setPickerLoading(true);
    setPickerError("");
    const result = await getGithubRepos();
    setPickerLoading(false);
    if ("error" in result) {
      setPickerError(result.error);
      return;
    }
    setRepos(result.repos);
  };

  const runAutofill = async (repoFullName: string) => {
    setAutofillState("loading");
    setAutofillError("");
    const result = await autofillProjectWithAI(repoFullName, domainType);
    if ("error" in result) {
      setAutofillState("error");
      setAutofillError(result.error);
      return;
    }
    setTitle(result.data.title);
    setDescription(result.data.description);
    
    const rawDesc = result.data.long_description || "";
    setBlocks(parseMarkdownToBlocks(rawDesc));
    setLongDescription("");

    setStack(result.data.stack.join(", "));
    if (result.data.category) {
      setCategory(result.data.category);
    }
    if ((result.data as any).theme_config) {
      const tc = (result.data as any).theme_config;
      setThemeConfig(typeof tc === "string" ? tc : JSON.stringify(tc));
    }
    setSlug(slugify(result.data.title));
    setAutofillState("idle");
  };

  const handleSelectRepo = (repoFullName: string) => {
    setRepoInput(repoFullName);
    setPickerOpen(false);
    setRepoSearch("");
    runAutofill(repoFullName); // autocompleta apenas eliges, sin clic extra
  };

  const filteredRepos = (repos || []).filter(r =>
    r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const handleCaptureScreenshot = async () => {
    setScreenshotState("loading");
    setScreenshotError("");
    const result = await captureScreenshot(demolink);
    if ("error" in result) {
      setScreenshotState("error");
      setScreenshotError(result.error);
      return;
    }
    setImagePreview(result.imageUrl);
    setScreenshotState("idle");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Previsualización instantánea en el cliente usando FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setUploadState("loading");
    setUploadError("");
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImageFile(fd);
    if ("error" in result) {
      setUploadState("error");
      setUploadError(result.error);
      e.target.value = "";
      return;
    }
    if ("imageUrl" in result && result.imageUrl) {
      setImagePreview(result.imageUrl);
    }
    setUploadState("idle");
    e.target.value = "";
  };

  const handleApkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".apk")) {
      setApkUploadState("error");
      setApkUploadError("El archivo debe tener la extensión .apk");
      e.target.value = "";
      return;
    }

    setApkUploadState("loading");
    setApkUploadError("");
    setApkUploadProgress(0);
    setApkUploadDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      loaded: "0 MB"
    });

    try {
      const res = await getApkSignedUploadUrlAction(file.name);
      if ("error" in res && res.error) {
        setApkUploadState("error");
        setApkUploadError(res.error);
        e.target.value = "";
        return;
      }

      if (!res.signedUrl || !res.publicUrl) {
        setApkUploadState("error");
        setApkUploadError("No se pudo generar la URL de subida.");
        e.target.value = "";
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", res.signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "application/vnd.android.package-archive");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          setApkUploadProgress(percent);
          setApkUploadDetails({
            name: file.name,
            size: (event.total / (1024 * 1024)).toFixed(1) + " MB",
            loaded: (event.loaded / (1024 * 1024)).toFixed(1) + " MB"
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setApkUploadProgress(100);
          setPlaystore(res.publicUrl!);
          setTimeout(() => {
            setApkUploadState("idle");
            setApkUploadDetails(null);
          }, 3500);
        } else {
          setApkUploadState("error");
          setApkUploadError(`Error de almacenamiento HTTP ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setApkUploadState("error");
        setApkUploadError("Error de conexión durante la subida del APK.");
      };

      xhr.send(file);
    } catch (err: any) {
      setApkUploadState("error");
      setApkUploadError(err.message || "Error inesperado al subir el APK.");
    } finally {
      e.target.value = "";
    }
  };

  const handleIpaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".ipa") && !file.name.toLowerCase().endsWith(".zip")) {
      setIpaUploadState("error");
      setIpaUploadError("El archivo debe tener extensión .ipa o .zip");
      e.target.value = "";
      return;
    }

    setIpaUploadState("loading");
    setIpaUploadError("");
    setIpaUploadProgress(0);
    setIpaUploadDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      loaded: "0 MB"
    });

    try {
      const res = await getIpaSignedUploadUrlAction(file.name);
      if ("error" in res && res.error) {
        setIpaUploadState("error");
        setIpaUploadError(res.error);
        e.target.value = "";
        return;
      }

      if (!res.signedUrl || !res.publicUrl) {
        setIpaUploadState("error");
        setIpaUploadError("No se pudo generar la URL de subida.");
        e.target.value = "";
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", res.signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "application/x-itunes-ipa");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          setIpaUploadProgress(percent);
          setIpaUploadDetails({
            name: file.name,
            size: (event.total / (1024 * 1024)).toFixed(1) + " MB",
            loaded: (event.loaded / (1024 * 1024)).toFixed(1) + " MB"
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setIpaUploadProgress(100);
          setAppstore(res.publicUrl!);
          setTimeout(() => {
            setIpaUploadState("idle");
            setIpaUploadDetails(null);
          }, 3500);
        } else {
          setIpaUploadState("error");
          setIpaUploadError(`Error de almacenamiento HTTP ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setIpaUploadState("error");
        setIpaUploadError("Error de conexión durante la subida del IPA.");
      };

      xhr.send(file);
    } catch (err: any) {
      setIpaUploadState("error");
      setIpaUploadError(err.message || "Error inesperado al subir el IPA.");
    } finally {
      e.target.value = "";
    }
  };


  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploadState("loading");
    setInlineUploadError("");
    
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImageFile(fd);
    
    if ("error" in result) {
      setInlineUploadState("error");
      setInlineUploadError(result.error);
    } else if ("imageUrl" in result && result.imageUrl) {
      // Inyectar en el textarea
      const textarea = textareaRef.current;
      const markdownImage = `\n![Imagen insertada](${result.imageUrl})\n`;
      
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = long_description;
        const newText = currentText.substring(0, start) + markdownImage + currentText.substring(end);
        setLongDescription(newText);
        
        // Volver a poner el foco y el cursor
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length);
        }, 10);
      } else {
        setLongDescription(prev => prev + markdownImage);
      }
      setInlineUploadState("idle");
    }
    e.target.value = "";
  };

  const insertBlockAt = (index: number, type: "h2" | "p" | "image") => {
    const newBlock: UIBlock = {
      id: String(Date.now() + Math.random()),
      type,
      content: "",
      url: type === "image" ? "" : undefined,
      alt: type === "image" ? "Imagen del artículo" : undefined,
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    setBlocks(newBlocks);
  };

  const compileBlocksToMarkdown = () => {
    return blocks.map(b => {
      if (b.type === "h2") return `## ${b.content}`;
      if (b.type === "p") return b.content;
      if (b.type === "image") {
        if (!b.url) return ""; // Avoid empty src attribute error in ReactMarkdown
        const cleanUrl = b.url.replace(/\s+/g, "");
        return `![${b.alt || "Imagen insertada"}](${cleanUrl})`;
      }
      return b.content;
    }).filter(Boolean).join("\n\n");
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitState("loading");
    setSubmitError("");
    
    formData.set("domainType", domainType);

    // Si es subruta, forzamos que demolink sea "" internamente
    if (domainType === "subruta") {
      formData.set("demolink", "");
    }
    // Convertir los bloques visuales a un solo string Markdown antes de guardar
    if (domainType !== "externa") {
      formData.set("long_description", compileBlocksToMarkdown());
    }

    formData.set("title", title);
    formData.set("category", category);
    formData.set("description", description);
    formData.set("slug", slug);
    formData.set("stack", stack);
    formData.set("status", status);
    formData.set("demolink", demolink);
    formData.set("playstore", playstore);
    formData.set("appstore", appstore);
    formData.set("is_featured", is_featured ? "true" : "false");

    let finalThemeConfig = themeConfig || "{}";
    try {
      const parsed = JSON.parse(finalThemeConfig || "{}");
      parsed.qr = {
        theme: qrTheme,
        badgeStyle: qrBadgeStyle,
        cardBg: qrCardBg,
        cornerStyle: qrCornerStyle,
        outerFrame: qrOuterFrame,
        qrBorder: qrBorderStyle,
        textTone: qrTextTone,
      };
      finalThemeConfig = JSON.stringify(parsed);
    } catch {
      finalThemeConfig = JSON.stringify({
        qr: {
          theme: qrTheme,
          badgeStyle: qrBadgeStyle,
          cardBg: qrCardBg,
          cornerStyle: qrCornerStyle,
          outerFrame: qrOuterFrame,
          qrBorder: qrBorderStyle,
          textTone: qrTextTone,
        }
      });
    }
    formData.set("theme_config", finalThemeConfig);
    formData.set("legal_config", JSON.stringify({
      has_privacy: hasPrivacy,
      has_terms: hasTerms,
      has_credits: hasCredits,
      has_ai: hasAi,
      has_admob: hasAdmob,
      has_source_code: hasSourceCode
    }));

    let result;
    if (editingId) {
      result = await updateProjectAction(editingId, formData);
    } else {
      result = await createProject(formData);
    }

    if (result && "error" in result && result.error) {
      setSubmitState("error");
      setSubmitError(result.error);
    } else {
      setSubmitState("idle");
      if (editingId) {
        setProjectList(prev => prev.map(p => {
          if (p.id === editingId) {
            return {
              ...p,
              title,
              category,
              description,
              long_description: (formData.get("long_description") as string) || p.long_description,
              stack: stack.split(',').map(s => s.trim()).filter(Boolean),
              slug: slug.trim() || p.slug,
              demolink,
              playstore,
              appstore,
              image: (formData.get("image") as string || "") || p.image,
              is_featured,
              status,
              theme_config: themeConfig || p.theme_config,
              legal_config: JSON.stringify({
                has_privacy: hasPrivacy,
                has_terms: hasTerms,
                has_credits: hasCredits,
                has_ai: hasAi,
                has_admob: hasAdmob,
                has_source_code: hasSourceCode
              })
            };
          }
          return p;
        }));
      }
      if (!editingId) {
        setTitle(""); setDescription(""); setStack(""); setSlug(""); setRepoInput("");
        setCategory("Android"); setDemolink(""); setImagePreview(""); setLongDescription("");
        setStatus("Privado");
      }
      setEditingId(null);
      router.refresh();
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* TABLA DE PROYECTOS */}
      <div className="xl:col-span-2 bg-\[\#262626\] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-\[\#1A1A1A\] border-b border-gray-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Proyecto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projectList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay proyectos. Añade uno.
                  </td>
                </tr>
              ) : (
                projectList.map(proj => (
                  <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {proj.image ? (
                          <img src={proj.image} className="w-10 h-10 rounded-lg object-cover" alt={proj.title} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <FolderKanban size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{proj.title}</p>
                          <p className="text-xs text-blue-400 font-semibold">{proj.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                        (proj.status === 'Activo' || proj.status === 'Público')
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {(proj.status === 'Activo' || proj.status === 'Público') ? 'Activo' : 'Privado'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(proj.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                          title="Editar proyecto"
                        >
                          <Pencil size={16} />
                        </button>
                        
                        {proj.slug && (
                          <a
                            href={`https://www.atpdev.dev/apps/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors inline-flex"
                            title="Ver página pública del proyecto"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        {(proj.status === 'Activo' || proj.status === 'Público') ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(proj.id, proj.status)}
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                            title="Visible en el portal — Clic para ocultar (hacer Privado)"
                          >
                            <Eye size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(proj.id, proj.status)}
                            className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
                            title="Oculto del portal — Clic para publicar (hacer Activo)"
                          >
                            <EyeOff size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {editingId ? (
            <><Pencil size={20} className="text-purple-500" /> Editar Proyecto</>
          ) : (
            <><Plus size={20} className="text-blue-500" /> Nuevo Proyecto</>
          )}
        </h2>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5" ref={pickerRef} style={{ position: "relative" }}>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center justify-between">
              <span>Repo de GitHub / Código Fuente</span>
              <span className="text-[11px] text-gray-500 font-normal">Pega una URL o selecciona de tu cuenta</span>
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Github size={16} />
                </div>
                <input
                  type="text"
                  name="github_repo"
                  value={repoInput}
                  onChange={e => setRepoInput(e.target.value)}
                  placeholder="https://github.com/usuario/repositorio..."
                  className="w-full bg-[#1A1A1A] border border-gray-800 text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="button"
                onClick={openPicker}
                className="bg-[#1A1A1A] hover:bg-white/10 border border-gray-800 text-gray-300 px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0"
                title="Seleccionar repositorio desde tu cuenta de GitHub"
              >
                <Search size={14} />
                <span>Repos</span>
              </button>

              {repoInput && (
                <button
                  type="button"
                  onClick={() => runAutofill(repoInput)}
                  disabled={autofillState === "loading"}
                  title="Completar datos con IA analizando el repositorio"
                  className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 shadow-lg"
                >
                  {autofillState === "loading" ? <Loader2 size={14} className="animate-spin" /> : "✨ IA"}
                </button>
              )}
            </div>

            {pickerOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-\[\#262626\] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-gray-800 flex items-center gap-2">
                  <Search size={14} className="text-gray-500 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                    placeholder="Buscar repo..."
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {pickerLoading && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs py-6">
                      <Loader2 size={14} className="animate-spin" /> Cargando tus repos de GitHub...
                    </div>
                  )}

                  {pickerError && (
                    <p className="text-[11px] text-red-400 px-4 py-3">{pickerError}</p>
                  )}

                  {!pickerLoading && !pickerError && filteredRepos.length === 0 && (
                    <p className="text-xs text-gray-500 px-4 py-4 text-center">Sin resultados.</p>
                  )}

                  {!pickerLoading && filteredRepos.map(repo => (
                    <button
                      key={repo.full_name}
                      type="button"
                      onClick={() => handleSelectRepo(repo.full_name)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
                    >
                      {repo.private ? (
                        <Lock size={13} className="shrink-0 text-amber-400" />
                      ) : (
                        <Globe size={13} className="shrink-0 text-emerald-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{repo.full_name}</p>
                        {repo.description && (
                          <p className="text-[11px] text-gray-500 truncate">{repo.description}</p>
                        )}
                      </div>
                      {repo.language && (
                        <span className="shrink-0 text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                          {repo.language}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {autofillState === "error" && <p className="text-[11px] text-red-400">{autofillError}</p>}
            {editingProject?.github_synced_at && (
              <p className="text-[11px] text-gray-500">
                {editingProject.github_is_private ? "🔒 Privado" : "🌐 Público"} · ⭐ {editingProject.github_stars ?? 0} · {editingProject.github_language ?? "N/D"} · sincronizado {new Date(editingProject.github_synced_at).toLocaleDateString()}
                {editingProject.github_is_private && (
                  <> — sube la imagen manualmente, GitHub no genera preview de repos privados.</>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Título</label>
            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Ej. Lector QR Pro" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Slug (URL: atpdev.dev/app/...)</label>
            <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Se autogenera del título si lo dejas vacío" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              🏷️ Categoría / Nicho del Proyecto
            </label>
            <select name="category" value={category} onChange={e => setCategory(e.target.value)} className="bg-[#1A1A1A] border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium">
              <optgroup label="🏷️ Nichos e Industrias Principales">
                <option value="Medicina">🩺 Medicina, Salud & Farmacia</option>
                <option value="Juegos">🎮 Juegos & Entretenimiento</option>
                <option value="Musica">🎵 Música & Audio</option>
                <option value="MedioAmbiente">🌿 Ecología & Medio Ambiente</option>
                <option value="Herramientas">🛠️ Herramientas & Utilitarios</option>
                <option value="IA">🤖 Inteligencia Artificial & Automatización</option>
                <option value="Finanzas">💰 Finanzas, Crypto & Banca</option>
                <option value="Productividad">📊 Productividad & Gestión</option>
                <option value="Social">🗣️ Redes Sociales & Comunidad</option>
              </optgroup>
              <optgroup label="📱 Plataformas Básicas">
                <option value="Android">📱 Android Native App</option>
                <option value="iOS">🍏 iOS App</option>
                <option value="Web">🌐 Web App / SaaS</option>
                <option value="Otro">📦 Otro</option>
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Stack (separado por comas)</label>
            <input type="text" name="stack" value={stack} onChange={e => setStack(e.target.value)} required className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Kotlin, Compose, Room" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Arquitectura de Despliegue</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setDomainType("subruta"); setDemolink(""); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "subruta" ? "bg-blue-600/10 border-blue-500/50 text-blue-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Página SEO (Subruta)
              </button>
              <button
                type="button"
                onClick={() => setDomainType("subdominio")}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "subdominio" ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Ambos (Página SEO + Link)
              </button>
              <button
                type="button"
                onClick={() => { setDomainType("externa"); setLongDescription(""); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "externa" ? "bg-amber-600/10 border-amber-500/50 text-amber-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Solo Tarjeta (Externa)
              </button>
            </div>
          </div>

          {domainType !== "subruta" && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                URL Demo Web ({domainType === "subdominio" ? "Ej: almaniq.atpdev.dev" : "Ej: https://..."})
              </label>
              <input type="text" name="demolink" value={demolink} onChange={e => setDemolink(e.target.value)} required className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="https://..." />
            </div>
          )}
          {/* Si es subruta, la URL queda vacía y no molesta en la UI, el backend lo maneja. */}

          {/* Enlaces de Tiendas (Opcionales) y Subida Directa de APK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Play Store / APK Link
                </label>
                <button
                  type="button"
                  onClick={() => apkFileInputRef.current?.click()}
                  disabled={apkUploadState === "loading"}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 transition-all disabled:opacity-50"
                  title="Sube un archivo .apk directamente a Supabase Storage"
                >
                  {apkUploadState === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Subir APK
                </button>
              </div>
              <input
                type="text"
                name="playstore"
                value={playstore}
                onChange={e => setPlaystore(e.target.value)}
                className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm focus:ring-2 focus:ring-emerald-500/20"
                placeholder="https://play.google.com/... o URL de APK"
              />
              <input
                ref={apkFileInputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                onChange={handleApkFileUpload}
                className="hidden"
              />
              {apkUploadState === "loading" && apkUploadDetails && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 animate-in fade-in duration-200 shadow-lg shadow-emerald-950/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold truncate max-w-[180px] flex items-center gap-1.5">
                      <Loader2 size={13} className="animate-spin text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{apkUploadDetails.name}</span>
                    </span>
                    <span className="text-emerald-300 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      {apkUploadProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-150 relative shadow-[0_0_10px_#10b981]"
                      style={{ width: `${apkUploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>{apkUploadDetails.loaded} / {apkUploadDetails.size}</span>
                    <span className="text-emerald-400 font-medium">
                      {apkUploadProgress === 100 ? "¡Subida completada!" : "Subiendo a Supabase..."}
                    </span>
                  </div>
                </div>
              )}
              {apkUploadState === "idle" && playstore && (playstore.includes(".apk") || playstore.includes("/apks/")) && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                  <Check size={13} className="text-emerald-400" />
                  <span className="truncate">APK vinculado: {playstore.split("/").pop()}</span>
                </div>
              )}
              {apkUploadState === "error" && <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{apkUploadError}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  App Store / iOS Link
                </label>
                <button
                  type="button"
                  onClick={() => ipaFileInputRef.current?.click()}
                  disabled={ipaUploadState === "loading"}
                  className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-500/30 transition-all disabled:opacity-50"
                  title="Sube un archivo .ipa (iOS) directamente a Supabase Storage"
                >
                  {ipaUploadState === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Subir IPA (iOS)
                </button>
              </div>
              <input
                type="text"
                name="appstore"
                value={appstore}
                onChange={e => setAppstore(e.target.value)}
                className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://apps.apple.com/... o URL de .ipa / Appetize"
              />
              <input
                ref={ipaFileInputRef}
                type="file"
                accept=".ipa,.zip,application/x-itunes-ipa,application/zip"
                onChange={handleIpaFileUpload}
                className="hidden"
              />
              {ipaUploadState === "loading" && ipaUploadDetails && (
                <div className="p-3 bg-sky-950/40 border border-sky-500/40 rounded-xl space-y-2 animate-in fade-in duration-200 shadow-lg shadow-sky-950/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sky-400 font-bold truncate max-w-[180px] flex items-center gap-1.5">
                      <Loader2 size={13} className="animate-spin text-sky-400 flex-shrink-0" />
                      <span className="truncate">{ipaUploadDetails.name}</span>
                    </span>
                    <span className="text-sky-300 font-mono font-bold bg-sky-500/20 px-2 py-0.5 rounded-md">
                      {ipaUploadProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-sky-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 via-blue-400 to-indigo-400 rounded-full transition-all duration-150 relative shadow-[0_0_10px_#0284c7]"
                      style={{ width: `${ipaUploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>{ipaUploadDetails.loaded} / {ipaUploadDetails.size}</span>
                    <span className="text-sky-400 font-medium">
                      {ipaUploadProgress === 100 ? "¡Subida completada!" : "Subiendo a Supabase..."}
                    </span>
                  </div>
                </div>
              )}
              {ipaUploadState === "idle" && appstore && (appstore.includes(".ipa") || appstore.includes("/ipas/") || appstore.includes(".zip")) && (
                <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-medium bg-sky-500/10 border border-sky-500/20 p-2 rounded-lg">
                  <Check size={13} className="text-sky-400" />
                  <span className="truncate">iOS vinculado: {appstore.split("/").pop()}</span>
                </div>
              )}
              {ipaUploadState === "error" && <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{ipaUploadError}</p>}
            </div>
          </div>


          {/* Módulos Legales y Subpáginas Dinámicas */}
          <div className="bg-[#151515] border border-gray-800/80 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                🛡️ Módulos Legales y Subpáginas Dinámicas
              </span>
              <span className="text-[11px] text-gray-500">Selecciona los módulos a activar</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasPrivacy} onChange={e => setHasPrivacy(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-emerald-500/20" />
                <span>🔒 Política de Privacidad</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasTerms} onChange={e => setHasTerms(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-emerald-500/20" />
                <span>⚖️ Términos y Condiciones</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasCredits} onChange={e => setHasCredits(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-emerald-500/20" />
                <span>📜 Créditos y Fuentes</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasAi} onChange={e => setHasAi(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500/20" />
                <span>🤖 Cláusulas de IA (Gemini)</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasAdmob} onChange={e => setHasAdmob(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500/20" />
                <span>📢 Cláusulas de Anuncios (AdMob)</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition-all text-xs text-gray-300">
                <input type="checkbox" checked={hasSourceCode} onChange={e => setHasSourceCode(e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500/20" />
                <span>💻 Botón "Código Fuente"</span>
              </label>
            </div>

            <input
              type="hidden"
              name="legal_config"
              value={JSON.stringify({
                has_privacy: hasPrivacy,
                has_terms: hasTerms,
                has_credits: hasCredits,
                has_ai: hasAi,
                has_admob: hasAdmob,
                has_source_code: hasSourceCode
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Imagen del proyecto</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 shrink-0 rounded-lg bg-\[\#1A1A1A\] border border-gray-800 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Si la URL falla al cargar (ej. URL rota vieja de DB), oculta la imagen rota
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageOff size={18} className="text-gray-600" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCaptureScreenshot}
                    disabled={screenshotState === "loading" || !demolink.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                    title="Toma una captura real del sitio en la URL de arriba, como hace Vercel"
                  >
                    {screenshotState === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    Capturar del sitio
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadState === "loading"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                    title="Sube una imagen o logo desde tu computadora"
                  >
                    {uploadState === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Subir imagen
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            {screenshotState === "error" && <p className="text-[11px] text-red-400">{screenshotError}</p>}
            {uploadState === "error" && <p className="text-[11px] text-red-400">{uploadError}</p>}
            {!demolink.trim() && (
              <p className="text-[11px] text-gray-600">Para "Capturar del sitio" escribe la URL de arriba primero (debe estar desplegada). "Subir imagen" funciona siempre, incluso sin URL.</p>
            )}
            <input type="hidden" name="image" value={imagePreview} />
          </div>

          {/* BOTÓN GRADIENT BUILDER */}
          <div className="flex justify-center -mt-2 mb-2 relative z-10">
            <button
              type="button"
              onClick={() => setShowGradientBuilderModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/30 text-purple-300 px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
            >
              <Palette size={14} />
              🎨 Personalizar Tema y Portada
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción Corta</label>
            <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" placeholder="Breve descripción..."></textarea>
          </div>

          {domainType !== "externa" && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Maqueta del Artículo (Bloques AI)</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-500/20 transition-all"
                >
                  {showPreview ? "Cerrar Vista Previa" : "Ver Vista Previa"}
                </button>
              </div>

              {showPreview ? (
                <div className="bg-[#111] border border-gray-800 p-6 rounded-xl prose prose-invert max-w-none text-sm min-h-[300px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {compileBlocksToMarkdown() || "*El artículo está vacío...*"}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col gap-4 min-h-[300px]">
                  {blocks.length === 0 && (
                    <div className="text-sm text-gray-500 italic p-6 text-center border border-dashed border-gray-800 rounded-2xl bg-[#141414]">
                      <p className="font-semibold text-gray-400 mb-1">El artículo no contiene bloques visuales aún.</p>
                      <p className="text-xs text-gray-500">Puedes crearlos manualmente con los botones de abajo o autocompletar con IA.</p>
                    </div>
                  )}
                  {blocks.map((b, i) => (
                    <Fragment key={b.id}>
                      <div className="relative group bg-[#161616] border border-gray-800/80 hover:border-gray-700 rounded-xl p-4 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                            {b.type === "h2" ? "Subtítulo H2" : b.type === "p" ? "Párrafo" : "Imagen / Captura"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setBlocks(blocks.filter((_, idx) => idx !== i))}
                            className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                            title="Eliminar este bloque"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {b.type === "h2" && (
                          <input 
                            type="text" 
                            value={b.content} 
                            onChange={(e) => {
                              const newBlocks = [...blocks];
                              newBlocks[i].content = e.target.value;
                              setBlocks(newBlocks);
                            }}
                            className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-base font-bold text-white focus:outline-none focus:border-blue-500 placeholder-gray-600"
                            placeholder="Subtítulo..."
                          />
                        )}
                        {b.type === "p" && (
                          <textarea
                            value={b.content}
                            onChange={(e) => {
                              const newBlocks = [...blocks];
                              newBlocks[i].content = e.target.value;
                              setBlocks(newBlocks);
                            }}
                            className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-y min-h-[90px] placeholder-gray-600"
                            placeholder="Escribe el texto del párrafo..."
                            rows={3}
                          />
                        )}
                        {b.type === "image" && (
                          <div className="bg-[#111] border border-gray-800 rounded-lg p-3 flex flex-col items-center gap-3">
                            {b.url ? (
                              <div className="w-full flex flex-col gap-3">
                                <div className="relative group/img bg-black/40 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center p-2">
                                  <img src={b.url} alt={b.alt || "Previsualización"} className="max-h-56 rounded-md object-contain" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={b.alt || ""}
                                    onChange={(e) => {
                                      const newBlocks = [...blocks];
                                      newBlocks[i].alt = e.target.value;
                                      setBlocks(newBlocks);
                                    }}
                                    placeholder="Leyenda o descripción de la imagen..."
                                    className="flex-1 bg-[#1A1A1A] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                                  />
                                  <div className="relative">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if(!file) return;
                                        setInlineUploadState("loading");
                                        const fd = new FormData(); fd.set("file", file);
                                        const res = await uploadImageFile(fd);
                                        if("imageUrl" in res && res.imageUrl) {
                                          const newBlocks = [...blocks];
                                          newBlocks[i].url = res.imageUrl;
                                          setBlocks(newBlocks);
                                        }
                                        setInlineUploadState("idle");
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <button type="button" className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-500/20 transition-all pointer-events-none flex items-center gap-1.5">
                                      <Upload size={12} />
                                      Cambiar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="py-4 flex flex-col items-center gap-2">
                                <Camera size={24} className="text-gray-500" />
                                <p className="text-xs text-gray-400 font-medium text-center">
                                  {b.context || "Sube una imagen para este bloque"}
                                </p>
                                <div className="relative mt-1">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if(!file) return;
                                      setInlineUploadState("loading");
                                      const fd = new FormData(); fd.set("file", file);
                                      const res = await uploadImageFile(fd);
                                      if("imageUrl" in res && res.imageUrl) {
                                        const newBlocks = [...blocks];
                                        newBlocks[i].url = res.imageUrl;
                                        setBlocks(newBlocks);
                                      }
                                      setInlineUploadState("idle");
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                  <button type="button" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all pointer-events-none flex items-center gap-2">
                                    {inlineUploadState === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                    {inlineUploadState === "loading" ? "Subiendo..." : "Subir Foto"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* DIVIDER DE INSERCIÓN INTERMEDIA EN HOVER */}
                      <div className="relative my-1 group/divider flex items-center justify-center h-6">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-800/40 group-hover/divider:bg-blue-500/50 transition-colors" />
                        <div className="opacity-0 group-hover/divider:opacity-100 transition-all duration-200 z-10 flex items-center gap-1.5 bg-[#181818] border border-blue-500/40 px-3 py-1 rounded-full shadow-xl text-[10px] font-bold text-blue-400">
                          <span className="text-gray-400 font-medium mr-1">Insertar aquí:</span>
                          <button type="button" onClick={() => insertBlockAt(i + 1, "h2")} className="hover:text-white bg-blue-500/10 px-2 py-0.5 rounded transition-colors">+ H2</button>
                          <button type="button" onClick={() => insertBlockAt(i + 1, "p")} className="hover:text-white bg-purple-500/10 px-2 py-0.5 rounded text-purple-300 transition-colors">+ Párrafo</button>
                          <button type="button" onClick={() => insertBlockAt(i + 1, "image")} className="hover:text-white bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 transition-colors">+ Imagen</button>
                        </div>
                      </div>
                    </Fragment>
                  ))}

                  {/* CONTROLES PARA AÑADIR NUEVOS BLOQUES */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setBlocks([...blocks, { id: String(Date.now()), type: "h2", content: "" }])}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-semibold transition-all"
                    >
                      <Plus size={13} /> Subtítulo H2
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlocks([...blocks, { id: String(Date.now()), type: "p", content: "" }])}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 text-xs font-semibold transition-all"
                    >
                      <Plus size={13} /> Párrafo
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlocks([...blocks, { id: String(Date.now()), type: "image", content: "", url: "", alt: "Imagen del artículo" }])}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                    >
                      <Camera size={13} /> Imagen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              name="is_featured" 
              checked={is_featured} 
              onChange={e => setIsFeatured(e.target.checked)} 
              value="true"
              className="w-4 h-4 rounded border-gray-800 bg-[#1A1A1A] text-blue-500 focus:ring-blue-500/50" 
            />
            <span className="text-sm font-semibold text-gray-300">Destacar proyecto (Mostrar primero en inicio)</span>
          </label>

          {/* Selector de Estado / Visibilidad */}
          <div className="flex flex-col gap-1.5 bg-[#151515] p-3 rounded-xl border border-gray-800/80 mt-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center justify-between">
              <span>Visibilidad en el Portal</span>
              <span className={status === "Activo" ? "text-emerald-400 font-bold text-xs" : "text-amber-400 font-bold text-xs"}>
                {status === "Activo" ? "● Activo (Público)" : "● Privado (Oculto)"}
              </span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus("Activo")}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  status === "Activo"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                <Eye size={14} />
                Activo (Visible)
              </button>
              <button
                type="button"
                onClick={() => setStatus("Privado")}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  status === "Privado"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                <EyeOff size={14} />
                Privado (Oculto)
              </button>
            </div>
            <input type="hidden" name="status" value={status} />
          </div>

          {/* Configuración Oficial del Código QR (Valores por Defecto en Portal) */}
          <div className="bg-[#151515] p-4 rounded-xl border border-gray-800/80 space-y-3 mt-1">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode size={14} className="text-emerald-400" />
                Estilo Oficial del Código QR
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-medium">Predeterminado</span>
            </div>

            {/* Tema de color por defecto */}
            <div>
              <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Color / Tema Predeterminado</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "emerald", label: "ATP Cyber", color: "#10b981" },
                  { id: "azure", label: "Tech Blue", color: "#38bdf8" },
                  { id: "purple", label: "Synthwave", color: "#c084fc" },
                  { id: "amber", label: "Gold Amber", color: "#fbbf24" },
                  { id: "minimal", label: "Monocromo", color: "#ffffff" },
                  { id: "print", label: "Impresión", color: "#0f172a" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setQrTheme(t.id)}
                    className={`py-1.5 px-2 text-xs rounded-xl border transition-all text-left truncate flex items-center gap-1.5 ${
                      qrTheme === t.id
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm font-semibold"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Borde del logo central */}
            <div>
              <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Borde del Logo Central</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "white", label: "⚪ Blanco" },
                  { id: "transparent", label: "🏁 Transp." },
                  { id: "accent", label: "🟢 Neón" },
                  { id: "dark", label: "⚫ Oscuro" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setQrBadgeStyle(b.id)}
                    className={`py-1.5 px-1.5 text-xs rounded-xl border transition-all text-center truncate ${
                      qrBadgeStyle === b.id
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm font-semibold"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                    title={b.label}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Esquinas del QR y Marco Exterior */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Esquinas del QR</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "rounded", label: "Curvo" },
                    { id: "squircle", label: "Suave" },
                    { id: "square", label: "Recto" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQrCornerStyle(s.id)}
                      className={`py-1.5 px-1 text-xs rounded-xl border transition-all text-center truncate ${
                        qrCornerStyle === s.id
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm font-semibold"
                          : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                      }`}
                      title={s.label}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Marco Exterior</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "neon", label: "Neón" },
                    { id: "white", label: "Blanco" },
                    { id: "none", label: "Sin Marco" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setQrOuterFrame(m.id)}
                      className={`py-1.5 px-1 text-xs rounded-xl border transition-all text-center truncate ${
                        qrOuterFrame === m.id
                          ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm font-semibold"
                          : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                      }`}
                      title={m.label}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fondo de descarga predeterminado */}
            <div>
              <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Fondo de Descarga Predeterminado</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "dark", label: "⚫ Tarjeta Dark" },
                  { id: "light", label: "⚪ Tarjeta Blanca" },
                  { id: "transparent", label: "🏁 PNG Transp." },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setQrCardBg(c.id)}
                    className={`py-1.5 px-2 text-xs rounded-xl border transition-all text-center truncate ${
                      qrCardBg === c.id
                        ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm font-semibold"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                    title={c.label}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tono de texto del QR predeterminado */}
            <div>
              <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Color de Título del QR (Predeterminado)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "auto", label: "🎨 Auto (Inteligente)" },
                  { id: "dark", label: "⬛ Oscuro (#0f172a)" },
                  { id: "light", label: "⬜ Claro (#ffffff)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setQrTextTone(t.id)}
                    className={`py-1.5 px-2 text-xs rounded-xl border transition-all text-center truncate ${
                      qrTextTone === t.id
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm font-semibold"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                    title={t.label}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <input type="hidden" name="theme_config" value={themeConfig} />

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-sm text-red-400 mt-2">
              <span className="font-bold block mb-1">Error al guardar:</span>
              {submitError}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={submitState === "loading"}
              className={`${editingId ? 'w-2/3 bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'} text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {submitState === "loading" && <Loader2 size={16} className="animate-spin" />}
              {editingId ? "Guardar Cambios" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>

      {/* GRADIENT BUILDER MODAL */}
      {showGradientBuilderModal && (
        <ProjectThemeStudio 
          title={title}
          previewPath={editingId && slug ? `/es/apps/${slug}` : ""}
          initialConfig={themeConfig}
          onClose={() => setShowGradientBuilderModal(false)}
          onChange={(config) => setThemeConfig(JSON.stringify(config))}
          onCoverGenerated={async (dataUrl) => {
            setImagePreview(dataUrl);
            try {
              setUploadState("loading");
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              const file = new File([blob], `cover_${Date.now()}.png`, { type: "image/png" });
              const fd = new FormData();
              fd.set("file", file);
              const result = await uploadImageFile(fd);
              if (result && "imageUrl" in result && result.imageUrl) {
                setImagePreview(result.imageUrl);
              }
              setUploadState("idle");
            } catch (error) {
              console.error("Error uploading gradient", error);
              setUploadState("error");
              setUploadError("Error al subir la imagen autogenerada.");
            }
          }}
        />
      )}
    </div>
  );
}