"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Download, Eraser, Upload, FileType2, Check, ChevronsUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type TemplateType = "classic" | "modern" | "elegant";

const certificateCategories: Record<string, string[]> = {
  "Education": [
    "Achievement Certificate", "Academic Excellence Certificate", "Merit Certificate", 
    "Excellence in Subject Certificate", "Perfect Attendance Certificate", 
    "Outstanding Performance Certificate", "Student of the Month Certificate", 
    "Most Improved Student Certificate", "Best Project Certificate", 
    "Best Presentation Certificate", "Reading Achievement Certificate", 
    "Writing Achievement Certificate", "Mathematics Excellence Certificate", 
    "Science Excellence Certificate", "Computer Excellence Certificate", 
    "Language Proficiency Certificate"
  ],
  "Competition": [
    "First Prize Certificate", "Second Prize Certificate", "Third Prize Certificate", 
    "Winner Certificate", "Runner-up Certificate", "Participation Certificate", 
    "Quiz Competition Certificate", "Debate Competition Certificate", 
    "Essay Writing Certificate", "Drawing Competition Certificate", 
    "Science Fair Certificate", "Hackathon Certificate", "Coding Competition Certificate", 
    "Chess Competition Certificate", "Sports Competition Certificate"
  ],
  "School & College": [
    "Course Completion Certificate", "Training Completion Certificate", 
    "Workshop Participation Certificate", "Seminar Participation Certificate", 
    "Internship Completion Certificate", "Volunteer Certificate", 
    "Leadership Certificate", "Club Membership Certificate", "Student Ambassador Certificate"
  ],
  "Corporate": [
    "Employee of the Month", "Employee Recognition Certificate", "Appreciation Certificate", 
    "Outstanding Performance Certificate", "Years of Service Certificate", 
    "Training Completion Certificate", "Team Excellence Award", 
    "Leadership Award", "Innovation Award"
  ],
  "Appreciation": [
    "Certificate of Appreciation", "Certificate of Recognition", "Thank You Certificate", 
    "Volunteer Appreciation Certificate", "Mentor Appreciation Certificate", 
    "Teacher Appreciation Certificate", "Guest Speaker Appreciation Certificate", 
    "Sponsor Appreciation Certificate"
  ],
  "Events": [
    "Event Participation Certificate", "Organizing Committee Certificate", 
    "Speaker Certificate", "Judge Certificate", "Volunteer Certificate", 
    "Cultural Event Certificate", "Music Competition Certificate", "Dance Competition Certificate"
  ],
  "Sports": [
    "Champion Certificate", "Participation Certificate", "Best Player Award", 
    "MVP Certificate", "Fair Play Award", "Sportsmanship Award", "Coach Appreciation Certificate"
  ],
  "Online Learning": [
    "Online Course Completion", "Bootcamp Completion", "Webinar Attendance", 
    "Certification of Skills", "Learning Achievement"
  ]
};

export default function CertificateGeneratorTool() {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("Education");
  const [certType, setCertType] = useState(certificateCategories["Education"][0]);
  
  const [customTitle, setCustomTitle] = useState("");
  const [recipient, setRecipient] = useState("Jane Doe");
  const [organization, setOrganization] = useState("Global Tech University");
  const [achievement, setAchievement] = useState("Advanced Web Development Program");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [issuer, setIssuer] = useState("John Smith");
  const [template, setTemplate] = useState<TemplateType>("classic");

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);

  // Digital Signature
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [sigImageUrl, setSigImageUrl] = useState<string | null>(null);
  const [sigImageObj, setSigImageObj] = useState<HTMLImageElement | null>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);

  // Update certificate title when category/type changes, unless custom title is set
  const displayTitle = customTitle || certType.toUpperCase();

  // Load Logo Image
  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.onload = () => {
        setLogoImage(img);
      };
      img.src = logoUrl;
    } else {
      setLogoImage(null);
    }
  }, [logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (sigImageUrl) {
      const img = new Image();
      img.onload = () => setSigImageObj(img);
      img.src = sigImageUrl;
    } else {
      setSigImageObj(null);
    }
  }, [sigImageUrl]);

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSigImageUrl(event.target?.result as string);
        setHasSignature(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // --------------------------------------------------------
  // Signature Pad Logic
  // --------------------------------------------------------
  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(event);
    if (!coords) return;
    const ctx = sigCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0f172a";
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    const ctx = sigCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      drawCertificate(); // Update preview when stroke finishes
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    setSigImageUrl(null);
    setSigImageObj(null);
    if (sigFileInputRef.current) sigFileInputRef.current.value = "";
    drawCertificate();
  };

  // --------------------------------------------------------
  // Certificate Drawing Logic
  // --------------------------------------------------------
  const drawCertificate = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (template === "classic") {
      drawClassic(ctx, width, height);
    } else if (template === "modern") {
      drawModern(ctx, width, height);
    } else if (template === "elegant") {
      drawElegant(ctx, width, height);
    }

    // Draw Signature Image if available, otherwise draw typed name
    // Draw Signature Image if available, otherwise draw typed name
    if (sigImageObj) {
      const sigRatio = sigImageObj.width / sigImageObj.height;
      const drawHeight = 75;
      const drawWidth = drawHeight * sigRatio;
      ctx.drawImage(sigImageObj, width - 250 - (drawWidth / 2), 470, drawWidth, drawHeight);
    } else if (hasSignature && sigCanvasRef.current) {
      ctx.drawImage(sigCanvasRef.current, width - 350, 470, 200, 75);
    } else {
      ctx.textAlign = "center";
      ctx.font = "italic 28px serif";
      ctx.fillStyle = template === "modern" ? "#0f172a" : (template === "elegant" ? "#4338ca" : "#0f172a");
      ctx.fillText(issuer || "[Issuer Name]", width - 250, 520);
    }

  }, [recipient, displayTitle, achievement, organization, date, issuer, template, hasSignature, logoImage]);

  useEffect(() => {
    drawCertificate();
  }, [drawCertificate]);

  // --- Templates ---
  const drawClassic = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 15;
    ctx.strokeStyle = "#1a365d";
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Organization Logo
    if (logoImage) {
      const imgWidth = 100;
      const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
      ctx.drawImage(logoImage, width / 2 - imgWidth / 2, 70, imgWidth, imgHeight);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#1a365d";
    ctx.font = "bold 40px serif";
    ctx.fillText(displayTitle, width / 2, logoImage ? 220 : 160);

    ctx.fillStyle = "#64748b";
    ctx.font = "20px sans-serif";
    ctx.fillText("This certificate is proudly presented to", width / 2, logoImage ? 260 : 210);

    ctx.fillStyle = "#0f172a";
    ctx.font = "italic bold 56px serif";
    ctx.fillText(recipient || "[Recipient Name]", width / 2, logoImage ? 340 : 290);

    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, logoImage ? 360 : 310);
    ctx.lineTo(width / 2 + 250, logoImage ? 360 : 310);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "20px sans-serif";
    ctx.fillText("For successfully completing the program/course:", width / 2, logoImage ? 400 : 360);

    ctx.fillStyle = "#1a365d";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(achievement || "[Achievement]", width / 2, logoImage ? 440 : 400);

    // Footer Lines
    ctx.fillStyle = "#334155";
    ctx.font = "20px sans-serif";
    
    // Organization text if no logo, or even with logo at bottom
    ctx.font = "bold 22px serif";
    ctx.fillText(organization || "[Organization]", width / 2, height - 80);

    ctx.font = "20px sans-serif";
    ctx.fillText(date, 250, 520);
    ctx.beginPath();
    ctx.moveTo(150, 535);
    ctx.lineTo(350, 535);
    ctx.moveTo(width - 350, 535);
    ctx.lineTo(width - 150, 535);
    ctx.stroke();
    
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Date", 250, 560);
    ctx.fillText("Signature", width - 250, 560);
  };

  const drawModern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#2563eb"; 
    ctx.fillRect(0, 0, 40, height);

    if (logoImage) {
      const imgWidth = 80;
      const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
      ctx.drawImage(logoImage, 100, 60, imgWidth, imgHeight);
    } else {
      ctx.textAlign = "left";
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(organization || "[Organization Name]", 100, 90);
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 38px sans-serif";
    
    const words = displayTitle.split(" ");
    let line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    let line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
    if (words.length <= 2) {
      line1 = words[0] || "";
      line2 = words[1] || "";
    }
    
    ctx.fillText(line1, 100, 180);
    ctx.fillStyle = "#2563eb";
    ctx.fillText(line2, 100, 225);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("PROUDLY PRESENTED TO:", 100, 290);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(recipient || "[Recipient Name]", 100, 350);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("FOR SUCCESSFUL COMPLETION OF", 100, 410);

    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(achievement || "[Achievement]", 100, 445);

    // Footer Lines
    ctx.textAlign = "center";
    ctx.fillStyle = "#334155";
    ctx.font = "20px sans-serif";
    ctx.fillText(date, 200, 520);
    ctx.beginPath();
    ctx.moveTo(100, 535);
    ctx.lineTo(300, 535);
    ctx.moveTo(width - 350, 535);
    ctx.lineTo(width - 150, 535);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("DATE", 200, 560);
    ctx.fillText("SIGNATURE", width - 250, 560);
  };

  const drawElegant = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#b45309";
    ctx.strokeRect(40, 40, width - 80, height - 80);
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, width - 92, height - 92);

    ctx.textAlign = "center";
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 22px serif";
    ctx.fillText(organization || "[Organization Name]", width / 2, 90);

    if (logoImage) {
      const imgWidth = 60;
      const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
      ctx.drawImage(logoImage, width / 2 - imgWidth / 2, 110, imgWidth, imgHeight);
    }

    ctx.fillStyle = "#b45309";
    ctx.font = "italic 44px serif";
    ctx.fillText(displayTitle, width / 2, logoImage ? 230 : 170);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 22px serif";
    ctx.fillText("is hereby granted to", width / 2, logoImage ? 270 : 220);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 54px serif";
    ctx.fillText(recipient || "[Recipient Name]", width / 2, logoImage ? 340 : 290);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 22px serif";
    ctx.fillText("to certify completion of", width / 2, logoImage ? 390 : 350);

    ctx.fillStyle = "#b45309";
    ctx.font = "bold 26px serif";
    ctx.fillText(achievement || "[Achievement]", width / 2, logoImage ? 440 : 400);

    // Footer Lines
    ctx.fillStyle = "#334155";
    ctx.font = "20px serif";
    ctx.fillText(date, 250, 520);
    ctx.beginPath();
    ctx.moveTo(150, 535);
    ctx.lineTo(350, 535);
    ctx.moveTo(width - 350, 535);
    ctx.lineTo(width - 150, 535);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.font = "italic 16px serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Date", 250, 560);
    ctx.fillText("Authorized Signature", width - 250, 560);
  };

  // --------------------------------------------------------

  const handleDownloadPNG = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${certType.replace(/\s+/g, "-").toLowerCase()}-${recipient.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownloadPDF = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create a new window for printing the image to PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              @page { size: landscape; margin: 0; }
              body { margin: 0; display: flex; align-items: center; justify-content: center; background: white; width: 100vw; height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Editor Panel */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm h-fit max-h-[85vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold tracking-tight">Design & Details</h2>
        
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="signature">Signature</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="flex flex-col gap-4 mt-0">
            {/* Template Selector */}
            <div className="flex flex-col gap-2">
              <Label>Template</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["classic", "modern", "elegant"] as TemplateType[]).map((t) => (
                  <Button
                    key={t}
                    onClick={() => setTemplate(t)}
                    variant={template === t ? "default" : "outline"}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg capitalize transition-all ${
                      template === t
                        ? "shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label>Category</Label>
                <Popover open={openCategory} onOpenChange={setOpenCategory} modal={false}>
                  <PopoverTrigger 
                    className="flex w-full items-center justify-between h-10 font-normal bg-background rounded-md border border-input px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
                    role="combobox"
                    aria-expanded={openCategory}
                  >
                    <span className="truncate">{category || "Select category..."}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search category..." autoFocus={false} />
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {Object.keys(certificateCategories).map((cat) => (
                            <CommandItem
                              key={cat}
                              value={cat}
                              onSelect={(currentValue) => {
                                // Find exact case match since shadcn passes lowercase value
                                const exactMatch = Object.keys(certificateCategories).find(
                                  k => k.toLowerCase() === currentValue.toLowerCase()
                                ) || cat;
                                setCategory(exactMatch);
                                setCertType(certificateCategories[exactMatch][0]);
                                setCustomTitle("");
                                setOpenCategory(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check className={`mr-2 h-4 w-4 ${category === cat ? "opacity-100" : "opacity-0"}`} />
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <Label>Type</Label>
                <Popover open={openType} onOpenChange={setOpenType} modal={false}>
                  <PopoverTrigger 
                    className="flex w-full items-center justify-between h-10 font-normal bg-background rounded-md border border-input px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
                    role="combobox"
                    aria-expanded={openType}
                  >
                    <span className="truncate">{certType || "Select type..."}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search type..." autoFocus={false} />
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {certificateCategories[category]?.map((type) => (
                            <CommandItem
                              key={type}
                              value={type}
                              onSelect={(currentValue) => {
                                const exactMatch = certificateCategories[category].find(
                                  t => t.toLowerCase() === currentValue.toLowerCase()
                                ) || type;
                                setCertType(exactMatch);
                                setCustomTitle("");
                                setOpenType(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check className={`mr-2 h-4 w-4 ${certType === type ? "opacity-100" : "opacity-0"}`} />
                              {type}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Certificate Title (Custom Override)</Label>
              <Input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={`e.g. ${certType.toUpperCase()}`}
                className="w-full h-10 px-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Organization Logo</Label>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Image
                </Button>
                {logoUrl && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogoUrl(null)}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Remove Logo
                  </Button>
                )}
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="flex flex-col gap-4 mt-0">
            <div className="flex flex-col gap-2">
              <Label>Organization Name</Label>
              <Input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Global Tech University"
                className="w-full h-10 px-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Recipient Name</Label>
              <Input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Jane Doe"
                className="w-full h-10 px-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Reason / Achievement Details</Label>
              <Input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="Advanced Web Development Program"
                className="w-full h-10 px-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3"
              />
            </div>
          </TabsContent>

          <TabsContent value="signature" className="flex flex-col gap-4 mt-0">
            {/* Signature Pad */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Digital Signature</Label>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sigFileInputRef.current?.click()}
                    className="h-6 px-2 text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" /> Upload
                  </Button>
                  {hasSignature && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSignature}
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 font-medium h-6 px-2"
                    >
                      <Eraser className="h-3 w-3" /> Clear
                    </Button>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" ref={sigFileInputRef} onChange={handleSigUpload} />
              </div>
              
              <div className="relative w-full h-28 rounded-lg border border-border bg-background overflow-hidden group">
                {sigImageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/10">
                        <img src={sigImageUrl} className="max-h-full max-w-full object-contain p-2" />
                    </div>
                ) : (
                    <>
                        <canvas
                          ref={sigCanvasRef}
                          width={350}
                          height={112}
                          className="w-full h-full cursor-crosshair touch-none bg-muted/10"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                        {!hasSignature && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-muted-foreground/50 select-none">
                            Draw signature here
                          </div>
                        )}
                    </>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[1px] flex-1 bg-border/60"></div>
                <span className="text-[10px] uppercase text-muted-foreground/60 font-semibold tracking-wider">OR TYPE BELOW</span>
                <div className="h-[1px] flex-1 bg-border/60"></div>
              </div>

              <Input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="John Smith (Issuer Name)"
                disabled={hasSignature}
                className="w-full h-10 px-3 mt-2 disabled:opacity-50"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-4">
          <Button
            variant="secondary"
            onClick={handleDownloadPNG}
            className="flex-1 h-12 flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-secondary/80 active:scale-[0.98] transition-all"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 h-12 flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            <FileType2 className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">Live Preview</h2>
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-muted/30 p-4 sm:p-8 flex items-center justify-center min-h-[400px]">
          <canvas
            ref={mainCanvasRef}
            width={1000}
            height={700}
            className="max-w-full h-auto shadow-2xl rounded-sm ring-1 ring-border/50"
          />
        </div>
      </div>
    </div>
  );
}
