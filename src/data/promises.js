export const categories = [
  { id: 1, name: "साझा प्रतिबद्धता, समरूपता र जनविश्वास", icon: "Gavel", color: "bg-blue-100 text-[#2552f5]" },
  { id: 2, name: "प्रशासनिक सुधार, पुनसंरचना र व्यवहायिता", icon: "Globe", color: "bg-indigo-100 text-indigo-800" },
  { id: 3, name: "सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन", icon: "TrendingUp", color: "bg-green-100 text-green-800" },
  { id: 4, name: "डिजिटल शासन र डेटा गोभर्नेन्स र सञ्चार", icon: "Wheat", color: "bg-amber-100 text-amber-800" },
  { id: 5, name: "सुशासन, पारदर्शिता र भ्रष्टाचार नियंत्रण", icon: "Briefcase", color: "bg-orange-100 text-orange-800" },
  { id: 6, name: "सार्वजनिक खरीद र परियोजना व्यवस्थापन सुधार", icon: "HardHat", color: "bg-slate-100 text-slate-800" },
  { id: 7, name: "लगानी, उद्योग निजी क्षेत्र प्रबंधन र पर्यटन", icon: "Zap", color: "bg-yellow-100 text-yellow-800" },
  { id: 8, name: "उर्जा तथा जलस्रोत", icon: "GraduationCap", color: "bg-cyan-100 text-cyan-800" },
  { id: 9, name: "राजस्व सुधार", icon: "Stethoscope", color: "bg-red-100 text-red-800" },
  { id: 10, name: "स्वास्थ्य, शिक्षा र मानव विकास", icon: "Mountain", color: "bg-emerald-100 text-emerald-800" },
  { id: 11, name: "कृषि, भूमि पूर्वाधार र आधारभूत सेवा", icon: "Activity", color: "bg-pink-100 text-pink-800" },
  { id: 12, name: "अन्य रणनीतिक र सामाजिक सुरक्षा निर्णयहरू", icon: "Users", color: "bg-purple-100 text-purple-800" }
];

export const promises = Array.from({ length: 100 }, (_, i) => {
  const categoryId = (i % 12) + 1;
  const status = i % 3 === 0 ? "Completed" : i % 3 === 1 ? "In Progress" : "Pending";
  const progress = status === "Completed" ? 100 : status === "In Progress" ? Math.floor(Math.random() * 80) + 10 : 0;
  
  // Generate dates - some in past, some current
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2026, 2, 29);
  const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  const dateString = randomDate.toISOString().split('T')[0];
  
  return {
    id: i + 1,
    title: `वादा #${i + 1}: ${getPlaceholderTitle(categoryId, i)}`,
    description: `यो प्रतिशृङ्खला #${i + 1} काठमाडौं शहरको विकास र सुशासनको लागि एक महत्वपूर्ण पहल हो। यो नागरिकको जीवन सुधार गर्न र सार्वजनिक सेवा वितरणमा गुणस्तर बढाउन रणनीतिक रूपमा डिजाइन गरिएको छ।`,
    categoryId: categoryId,
    status: status,
    progress: progress,
    updatedAt: dateString,
    tags: ["नीति", "राष्ट्रिय"],
    sources: ["https://official-source.gov.np"]
  };
});

function getPlaceholderTitle(categoryId, index) {
  const themes = {
    1: ["प्रषासनिक प्रक्रिया को सुधार", "नागरिक सेवा को डिजिटलीकरण", "पारदर्शिता कार्यक्रम"],
    2: ["संरचनात्मक सुधार", "कार्मिक आधुनिकीकरण", "प्रभावी प्रशासन"],
    3: ["सार्वजनिक सेवा सुधार", "समस्या समाधान तन्त्र", "नागरिक संतुष्टि"],
    4: ["डिजिटल काठमाडौं", "डेटा सुरक्षा", "ई-साक्षरता कार्यक्रम"],
    5: ["भ्रष्टाचार नियंत्रण", "जवाबदेहिता प्रणाली", "पारदर्शी बजेट"],
    6: ["निष्पक्ष खरीद", "परियोजना प्रबन्धन", "लागत नियन्त्रण"],
    7: ["विनियोग आकर्षण", "पर्यटन विकास", "व्यावसायिक वातावरण"],
    8: ["ऊर्जा सुरक्षा", "पानी आपूर्ति", "नवीकरणीय ऊर्जा"],
    9: ["स्थानीय राजस्व वृद्धि", "कर सङ्कलन", "राजस्व प्रणाली"],
    10: ["शिक्षा गुणस्तर", "स्वास्थ्य सेवा", "कौशल विकास"],
    11: ["कृषि आधुनिकीकरण", "बुन्देली विकास", "भूमि सुधार"],
    12: ["सामाजिक सुरक्षा", "समावेशी विकास", "अल्पसंख्यक वर्ग सशक्तिकरण"]
  };
  
  const categoryThemes = themes[categoryId] || themes[1];
  return categoryThemes[index % categoryThemes.length];
}
