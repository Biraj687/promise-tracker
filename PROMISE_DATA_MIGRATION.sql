-- ============================================================================
-- PROMISE TRACKER: 100-POINT COMMITMENT DATA MIGRATION
-- Nepal Government Commitments - Comprehensive Data Setup
-- ============================================================================

-- Insert Main Category: Shared Commitment, Coordination and Public Trust
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('साझा प्रतिबद्धता, समन्वय र जनविश्वास', 'सम्वित् २०८२ फागुन २१ मा सम्पन्न आम मनवायचनलाई स्वच्छ, निष्पक्ष र स्वतन्त्र वातावरणमा सफलतापूर्वक सम्पन्न गराउने योगदान पूर्ण गर्ने ।', 'Heart', 'bg-red-50 text-red-700', NOW()),

-- Insert Main Category: Administrative Reform, Restructuring and Efficiency
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता', 'सरकारको समग्र कार्यसम्पादनलाई नतिजामुखी, प्रभावकारी, मापनयोग्य र जवाफदेही बनाउन ।', 'Cog', 'bg-blue-50 text-blue-700', NOW()),

-- Insert Main Category: Public Service Delivery and Complaint Management
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन', 'नागरिकलाई सरकारी सेवा मिन धेरै कार्यालय धाउनुपने, प्रवक्रियागत झरझट व्यहोनुपने समय र लागत दुवै बढ्ने अवस्थाको अन्त्य गर्न ।', 'Users', 'bg-green-50 text-green-700', NOW()),

-- Insert Main Category: Digital Governance and Data Management
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('डिजिटल शासन र डेटा गभनेन्स तथा सञ्चार', 'सार्वजनिक सेवा प्रवाहलाई द्रुत, पारदर्शी, कार्जरवहित तथा अन्तरआबद्ध बनाउन ।', 'Zap', 'bg-yellow-50 text-yellow-700', NOW()),

-- Insert Main Category: Good Governance, Transparency and Anti-Corruption  
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('सुशासन, पारदर्शिता र भ्रष्टाचार निरन्तरण', 'देशमा व्याप्त भ्रष्टाचार, सम्पन्ति लुकाउने प्रवृत्ति तथा दण्डहीनताको अन्त्य गर्न ।', 'Shield', 'bg-purple-50 text-purple-700', NOW()),

-- Insert Main Category: Public Procurement and Project Management Reform
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('सार्वजनिक खरीद र परियोजना व्यवस्थापन सुधार', 'सार्वजनिक खरीद प्रवक्रियामा हुने ढिलासुस्ती, लागत वृद्धि, गुणस्तरहीन कार्य तथा भ्रष्टाचार निरन्तरण गर्न ।', 'Package', 'bg-pink-50 text-pink-700', NOW()),

-- Insert Main Category: Investment, Industry, Private Sector Promotion and Tourism
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('लगानी, उद्योग, निजी क्षेत्र प्रवद्धन तथा पर्यटन', 'देशमा लगानी वातावरण सुधार गर्न उद्योग दर्ता, स्वीकृति तथा सञ्चालन प्रवक्रयालाई सरल, द्रुत तथा पारदर्शी बनाउन ।', 'TrendingUp', 'bg-cyan-50 text-cyan-700', NOW()),

-- Insert Main Category: Energy and Water Resources
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('ऊर्जा तथा जलस्रोत', 'ऊर्जा क्षेत्र विकासका लागि नेपालको ऊर्जा क्षेत्रलाई आर्थिक रूपारन्तरणको प्रमुख आधारका रूपमा विकास गर्न ।', 'Droplet', 'bg-teal-50 text-teal-700', NOW()),

-- Insert Main Category: Revenue Reform
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('राजस्व सुधार', 'राज्यका निष्क्रिय स्रोतहरूको प्रभावकारी उपयोग गर्न ।', 'DollarSign', 'bg-amber-50 text-amber-700', NOW()),

-- Insert Main Category: Health, Education and Human Development
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('स्वास्थ्य, शिक्षा र मानव विकास', 'स्वास्थ्य क्षेत्रको सुधार र शिक्षा क्षेत्रमा दलीय हस्तक्षेप, विद्यार्थीको वास्तविक आवाज नसमेटने र शैक्षिक गुणस्तर गिरावटको समस्या समाधान गर्न ।', 'Heart', 'bg-rose-50 text-rose-700', NOW()),

-- Insert Main Category: Agriculture, Land, Infrastructure and Basic Services
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('कृषि, भूमि, पूर्वाधार र आधारभूत सेवा', 'कृषि क्षेत्रको विकास र भूमिहीन सुकुम्बासी तथा अव्यवस्थित बसोबासी समस्या समाधान गर्न ।', 'Leaf', 'bg-lime-50 text-lime-700', NOW()),

-- Insert Main Category: Other Strategic and Social Security Issues  
INSERT INTO categories (name, description, icon, color, created_at) VALUES 
('अन्य रणनीतिक तथा सामाजिक सुरक्षा सम्बन्धी निर्णयहरू', 'कसूरजन्य सम्पन्ति व्यवस्थापन प्रकृयालाई सरल, सहज बनाउन र एकरूपता कायम गर्न ।', 'Flag', 'bg-indigo-50 text-indigo-700', NOW());

-- ============================================================================
-- CREATE NEWS/UPDATES TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS news_updates (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  image_url VARCHAR(1000),
  source_url VARCHAR(1000),
  source_name VARCHAR(255),
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  promise_id BIGINT REFERENCES promises(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  news_type VARCHAR(50) DEFAULT 'update', -- 'update', 'news', 'progress'
  thumbnail_url VARCHAR(1000),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news_updates(category_id);
CREATE INDEX IF NOT EXISTS idx_news_promise_id ON news_updates(promise_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_updates(is_published);

-- ============================================================================
-- SAMPLE DATA: Key Promises from 100-Point Commitment
-- ============================================================================

-- Category 1: Shared Commitment (Promises 1-8)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES 
(
  (SELECT id FROM categories WHERE name = 'साझा प्रतिबद्धता, समन्वय र जनविश्वास' LIMIT 1),
  'आम मनवायचन स्वच्छ सञ्चालन',
  'सम्वित् २०८२ फागुन २१ मा सम्पन्न आम मनवायचनलाई स्वच्छ, निष्पक्ष र स्वतन्त्र वातावरणमा सफलतापूर्वक सम्पन्न गराउने योगदान ।',
  'Completed',
  100,
  '2081-05-21'::'date',
  'प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय'
),
(
  (SELECT id FROM categories WHERE name = 'साझा प्रतिबद्धता, समन्वय र जनविश्वास' LIMIT 1),
  'Delivery-Based Governance लागू गर्न',
  'सरकारको समग्र कार्यसम्पादनलाई नतिजामुखी, प्रभावकारी, मापनयोग्य र जवाफदेही बनाउन नतिजामा आधारित शासकीय प्रवन्ध (Delivery-Based Governance) लागू गर्न ।',
  'In Progress',
  65,
  '2082-02-21'::'date',
  'प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय'
);

-- Category 2: Administrative Reform (Promises 9-19)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता' LIMIT 1),
  'मन्त्रालयको सङ्ख्या तोड्ने',
  'मन्त्रालयहरूको सङ्ख्या आवश्यकताभन्दा ठूलो भई चालु खचय बढेको समस्यालाई समाधान गर्न ३० दिनभित्र मन्त्रालयको सङ्ख्या तोड्ने निर्णय सवहिको मौजुदा नेपाल सरकार (कार्य विभाजन) नियमावली संशोधन गर्री सङ्घीय मन्त्रालयको सङ्ख्या १७ कायम गर्न ।',
  'Planning',
  25,
  '2082-02-21'::'date',
  'संघीय मामिला तथा सामान्य प्रशासन मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता' LIMIT 1),
  'Business Process Re-engineering (BPR) माफत् सेवा सुदृढ गर्न',
  'सबै सार्वजनिक निकायले सेवा प्रवाहमा विद्यमान दोहोरोपन, जटिलता तथा अनावश्यक प्रवक्रयाका कारण सेवा प्रवाह ढिलो, खर्चीलो र अप्रभावकारी भएको अवस्थालाई अन्त्य गर्न Business Process Re-engineering (BPR) माफत् सम्पूर्ण सेवा प्रवाहलाई सरल, छिटो तथा परिणाममुखी बनाउन ।',
  'Planning',
  30,
  '2082-02-21'::'date',
  'प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय'
);

-- Category 3: Public Service Delivery (Promises 20-27)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन' LIMIT 1),
  'नागरिक सेवा केन्द्र सञ्चालन गर्न',
  'नागरिकलाई सरकारी सेवा मिन धेरै कार्यालय धाउनुपने, प्रवक्रियागत झझट व्यहोनुपने तथा समय र लागत दुवै बढ्ने अवस्थाको अन्त्य गर्न प्रमुख शहरहरूमा एजेन्सिफिकेसन मोडामलिटीमा नागरिक सेवा केन्द्र सञ्चालन गर्न ।',
  'Planning',
  40,
  '2082-03-21'::'date',
  'सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन' LIMIT 1),
  'डिजिटल र एकीकृत प्रणाली सञ्चालन गर्न',
  'नागरिकलाई छिटो, सहज र बिचौलिया मुक्त सेवा उपलब्ध गराउन नागरिकता, राहदानी, राष्ट्रिय परिचयपत्र तथा जिल्ला प्रशासन कार्यालयबाट प्रदान हुने सम्पूर्ण सेवाहरूलाई डिजिटल तथा एकीकृत प्रणालीमाफत् सञ्चालन गर्न ।',
  'In Progress',
  50,
  '2082-02-21'::'date',
  'सञ्चार तथा सूचना प्रविधि मन्त्रालय'
);

-- Category 4: Digital Governance (Promises 28-42)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'डिजिटल शासन र डेटा गभनेन्स तथा सञ्चार' LIMIT 1),
  'GIOMS प्रणाली सुदृढ गर्न',
  'सार्वजनिक सेवा प्रवाहलाई छिटो, पारदर्शी, कार्जरवहित तथा अन्तरआवद्ध बनाउन सङ्घ, प्रदेश र स्थानीय तहका सबै सरकारी निकायहरूमा १०० दिनभित्र विद्यमान GIOMS प्रणालीलाई सुदृढ र प्रयोगकर्तामैत्री बनाउन ।',
  'Planning',
  45,
  '2082-02-21'::'date',
  'सञ्चार तथा सूचना प्रविधि मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'डिजिटल शासन र डेटा गभनेन्स तथा सञ्चार' LIMIT 1),
  'राष्ट्रिय एकीकृत डिजिटल शासन प्लेटफर्म स्थापना गर्न',
  'सार्वजनिक सेवा प्रवाहलाई पूर्ण रूपमा डिजिटल, एकद्वार र अन्तरआवद्ध प्रणालीमा रूपान्तरण गर्ने उद्देश्यले राष्ट्रिय एकीकृत डिजिटल शासन प्लेटफर्म स्थापना गर्री डिजिटल गभनेन्स ब्लुप्रिन्ट कार्यान्वयन गर्न ।',
  'Planning',
  20,
  '2082-05-21'::'date',
  'सञ्चार तथा सूचना प्रविधि मन्त्रालय'
);

-- Category 5: Anti-Corruption (Promises 43-47)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'सुशासन, पारदर्शिता र भ्रष्टाचार निरन्तरण' LIMIT 1),
  'अधिकारसम्पन्न सम्पन्ति छानबिन समिति गठन गर्न',
  'देशमा व्याप्त भ्रष्टाचार, सम्पन्ति लुकाउने प्रवृत्ति तथा दण्डहीनताको अन्त्य गर्न प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय अन्तर्गत रहने गरी १५ दिनभित्र अधिकारसम्पन्न सम्पन्ति छानबिन समिति गठन गर्न ।',
  'Planning',
  35,
  '2082-01-15'::'date',
  'प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय'
),
(
  (SELECT id FROM categories WHERE name = 'सुशासन, पारदर्शिता र भ्रष्टाचार निरन्तरण' LIMIT 1),
  'राष्ट्रिय सतकर्ता केन्द्रको पुनसंरचना गर्न',
  'सुशासन प्रवद्धन, भ्रष्टाचार निरन्तरण तथा सार्वजनिक सेवा प्रवाहमा पारदर्शिता र जवाफदेहिता अभिवृद्धि गर्न राष्ट्रिय सतकर्ता केन्द्रको पुनसंरचना योजना ३० दिनभित्र तयार गरी कार्यान्वयनमा ल्याउन ।',
  'Planning',
  25,
  '2082-02-21'::'date',
  'प्रधानमन्त्री र मन्त्रिपरिषद्को कार्यालय'
);

-- Category 6: Investment & Private Sector (Promises 53-72)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'लगानी, उद्योग, निजी क्षेत्र प्रवद्धन तथा पर्यटन' LIMIT 1),
  'उद्योग दर्ता प्रवक्रया सरल गर्न',
  'देशमा लगानी वातावरण सुधार गर्न उद्योग दर्ता, स्वीकृति तथा सञ्चालन प्रवक्रयालाई सरल, छिटो तथा पारदर्शी बनाउन उद्योग विभागमा रहेको एकल विन्दु सेवा केन्द्रमा खबटने कमर्चारीलाई थप अधिकार प्रत्यायोजन गरी प्रभावकारी बनाउन ।',
  'In Progress',
  60,
  '2082-02-21'::'date',
  'उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'लगानी, उद्योग, निजी क्षेत्र प्रवद्धन तथा पर्यटन' LIMIT 1),
  'Wellness Year 2027 मनाउन',
  'नेपाललाई आरोग्य पर्यटन (पूर्वीय दर्शन, ध्यान, योग, प्राकृतिक चिकित्सा लगायत) को हब बनाउन आरोग्य पर्यटन रणनीति १५ दिनभित्र जारी गर्न ।',
  'Planning',
  30,
  '2082-02-21'::'date',
  'संस्कृति, पर्यटन तथा नागरिक उड्डयन मन्त्रालय'
);

-- Category 7: Health, Education & Development (Promises 85-89)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'स्वास्थ्य, शिक्षा र मानव विकास' LIMIT 1),
  'निःशुल्क स्वास्थ्य सेवा उपलब्ध गराउन',
  'विपन्न, असहाय तथा बेवारिसे विरामीले अस्पताल सेवामा पहुँच नपाउने, आर्थिक कारणले उपचारबाट वञ्चित अवस्थाको अन्त्य गर्न सरकारी तथा निजी अस्पतालका कुल शय्यामध्ये कम्तीमा १० प्रतिशत निःशुल्क उपलब्ध गराउने व्यवस्था कडाइका साथ तत्काल कार्यान्वयन गर्न ।',
  'Planning',
  35,
  '2082-02-21'::'date',
  'स्वास्थ्य मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'स्वास्थ्य, शिक्षा र मानव विकास' LIMIT 1),
  'दलीय हस्तक्षेप हटाइय विद्यार्थी परिषद् स्थापना गर्न',
  'शिक्षा क्षेत्रमा दलीय हस्तक्षेप, विद्यार्थीको वास्तविक आवाज नसमेटने र शैक्षिक गुणस्तर गिरावटको समस्या समाधान गर्न ६० दिनभित्र विद्यालय/विश्वविद्यालय हातामाफत् दलीय विद्यार्थी सङ्गठनका संरचना हटाई ९० दिनभित्र Student Council/ Voice of Student संयन्त्रको विकास गर्न ।',
  'Planning',
  20,
  '2082-02-21'::'date',
  'शिक्षा, विज्ञान तथा प्रविधि मन्त्रालय'
);

-- Category 8: Agriculture & Land (Promises 90-92)
INSERT INTO promises (
  category_id,
  title,
  description,
  status,
  progress,
  target_date,
  responsible_ministry
) VALUES
(
  (SELECT id FROM categories WHERE name = 'कृषि, भूमि, पूर्वाधार र आधारभूत सेवा' LIMIT 1),
  'कृषि उपजको न्यूनतम मूल्य सुरक्षा सुमनिश्चित गर्न',
  'कृषि क्षेत्रको विकासका लागि प्रमुख कृषि उपजको न्यूनतम मूल्य सुरक्षा नहुँदा किसान बजारको अनियन्त्रित उतारचढावबाट पीडित हुने समस्या समाधान गर्न ३० दिनभित्र प्रमुख खाद्यान्न बाली

यको न्यूनतम समर्थन मूल्य निर्धारण प्रवक्रया सुरु गर्न ।',
  'Planning',
  25,
  '2082-02-21'::'date',
  'कृषि तथा पशुपञ्छी विकास मन्त्रालय'
),
(
  (SELECT id FROM categories WHERE name = 'कृषि, भूमि, पूर्वाधार र आधारभूत सेवा' LIMIT 1),
  'भूमिहीन सुकुम्बासी समस्या समाधान गर्न',
  'देशभरका भूमिहीन सुकुम्बासी तथा अव्यवस्थित बसोबासीको एकीकृत डिजिटल लगि सङ्कलन तथा प्रमाणीकरण ६० दिनभित्र सम्पन्न गर्न भूमिहीन सुकुम्बासी तथा अव्यवस्थित बसोबासी समस्या १००० दिनभित्र समाधान गर्न ।',
  'In Progress',
  45,
  '2082-12-21'::'date',
  'भूमि व्यवस्थापन, कृषि र सहकारी मन्त्रालय'
);

-- ============================================================================
-- SAMPLE NEWS/UPDATES
-- ============================================================================

INSERT INTO news_updates (
  title,
  description,
  source_name,
  source_url,
  category_id,
  news_type,
  is_published,
  created_at
) VALUES
(
  'काठमाडौंमा नागरिक सेवा केन्द्र स्थापना गरियो',
  'नागरिकहरूलाई सहज सेवा प्रदान गर्न काठमाडौंको विभिन्न स्थानमा नागरिक सेवा केन्द्र स्थापना गरिएको छ।',
  'सेतोपाती',
  'https://setopati.com',
  (SELECT id FROM categories WHERE name = 'सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन' LIMIT 1),
  'update',
  TRUE,
  NOW() - INTERVAL '2 days'
),
(
  'डिजिटल शासन प्लेटफर्म विकास प्रक्रिया सुरु',
  'सरकारले राष्ट्रिय एकीकृत डिजिटल शासन प्लेटफर्म विकास गर्न प्रक्रिया सुरु गरेको छ।',
  'काठमाडौं पोस्ट',
  'https://kathmandupost.com',
  (SELECT id FROM categories WHERE name = 'डिजिटल शासन र डेटा गभनेन्स तथा सञ्चार' LIMIT 1),
  'progress',
  TRUE,
  NOW() - INTERVAL '1 day'
);

-- ============================================================================
-- ENABLE RLS POLICIES FOR SECURITY
-- ============================================================================

ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_updates_read_policy" ON news_updates
  FOR SELECT USING (is_published = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "news_updates_write_policy" ON news_updates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "news_updates_update_policy" ON news_updates
  FOR UPDATE USING (auth.uid() = created_by);

-- ============================================================================
-- ENSURE DATABASE IS PROPERLY CONFIGURED
-- ============================================================================

-- Grant appropriate permissions
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON promises TO authenticated;
GRANT SELECT ON news_updates TO authenticated;
GRANT INSERT, UPDATE ON news_updates TO authenticated;
