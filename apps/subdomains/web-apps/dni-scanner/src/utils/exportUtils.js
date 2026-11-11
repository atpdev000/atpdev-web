import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, ImageRun, AlignmentType, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/**
 * Composites a PNG base64 onto a white background to prevent black corners in PDF/JPEG
 */
const prepareImageForDocument = async (base64Img) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            // Fill pure white background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image on top
            ctx.drawImage(img, 0, 0);

            // Subtle 1px anti-aliased border around card
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL("image/jpeg", 0.98));
        };
        img.onerror = () => resolve(base64Img);
        img.src = base64Img;
    });
};

/**
 * Saves or shares a file across Web and Native Android
 */
const saveOrShareFile = async (blob, fileName, mimeType) => {
    if (Capacitor.isNativePlatform()) {
        try {
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = reader.result.split(',')[1];
                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Cache
                });

                await Share.share({
                    title: fileName,
                    url: savedFile.uri,
                    dialogTitle: 'Compartir Documento DNI'
                });
            };
            return;
        } catch (err) {
            console.warn("Capacitor share failed, falling back to saveAs:", err);
        }
    }

    // Web Fallback
    saveAs(blob, fileName);
};

/**
 * Generates an official A4 PDF with front and back DNI images centered at exact 1:1 physical scale.
 */
export const generatePDF = async (frontBase64, backBase64) => {
    const cleanFront = await prepareImageForDocument(frontBase64);
    const cleanBack = await prepareImageForDocument(backBase64);

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Standard ISO ID-1 physical dimensions: 85.60 mm x 53.98 mm
    const dniWidth = 85.6;
    const dniHeight = 54.0;
    const x = (pageWidth - dniWidth) / 2;

    // Centered layout on upper half and mid section
    const yFront = 45;
    const yBack = yFront + dniHeight + 25;

    // Optional Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105); // slate-600
    pdf.text("DOCUMENTO NACIONAL DE IDENTIDAD (DNI)", pageWidth / 2, 25, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text("Copia digital a escala real 1:1 (ISO/IEC 7810 ID-1)", pageWidth / 2, 30, { align: "center" });

    // Front label & image
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("ANVERSO", x, yFront - 3);
    pdf.addImage(cleanFront, "JPEG", x, yFront, dniWidth, dniHeight, undefined, "FAST");

    // Back label & image
    pdf.text("REVERSO", x, yBack - 3);
    pdf.addImage(cleanBack, "JPEG", x, yBack, dniWidth, dniHeight, undefined, "FAST");

    // Footer note
    pdf.setFontSize(7);
    pdf.setTextColor(160, 174, 192);
    pdf.text("Generado con DNI Master Scanner • Listo para imprimir en formato A4 estándar", pageWidth / 2, pageHeight - 15, { align: "center" });

    const blob = pdf.output("blob");
    await saveOrShareFile(blob, "DNI-Digital-A4.pdf", "application/pdf");
};

/**
 * Generates an official Word (.docx) document with front and back DNI images centered at exact scale.
 */
export const generateWord = async (frontBase64, backBase64) => {
    const cleanFront = await prepareImageForDocument(frontBase64);
    const cleanBack = await prepareImageForDocument(backBase64);

    const base64ToBuffer = (base64) => {
        const binary = atob(base64.split(",")[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return array.buffer;
    };

    // 85.6mm in pixels at 96 DPI is ~323.5px
    const cardWidthPx = 324;
    const cardHeightPx = 204;

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
                    }
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "DOCUMENTO NACIONAL DE IDENTIDAD (DNI)",
                                bold: true,
                                size: 24,
                                color: "334155"
                            })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Copia digital a escala real 1:1",
                                size: 16,
                                color: "64748B"
                            })
                        ]
                    }),
                    new Paragraph({ text: "" }), // Space
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new ImageRun({
                                data: base64ToBuffer(cleanFront),
                                transformation: { width: cardWidthPx, height: cardHeightPx }
                            })
                        ]
                    }),
                    new Paragraph({ text: "" }), // Space
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new ImageRun({
                                data: base64ToBuffer(cleanBack),
                                transformation: { width: cardWidthPx, height: cardHeightPx }
                            })
                        ]
                    })
                ]
            }
        ]
    });

    const blob = await Packer.toBlob(doc);
    await saveOrShareFile(blob, "DNI-Digital.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
};

/**
 * Downloads a single card as a clean PNG with transparent rounded corners
 */
export const downloadCardPNG = async (base64Img, fileName = "DNI-Card.png") => {
    const res = await fetch(base64Img);
    const blob = await res.blob();
    await saveOrShareFile(blob, fileName, "image/png");
};
