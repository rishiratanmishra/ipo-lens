<?php
header("Content-Type: application/json; charset=UTF-8");

/* INPUT */
$id   = $_GET['id']   ?? '';
$slug = $_GET['slug'] ?? '';
$url  = ($id && $slug)
    ? "https://www.ipopremium.in/view/ipo/$id/$slug"
    : ($_GET['url'] ?? '');

if (!$url) {
    echo json_encode(["error" => "Missing url or id+slug"]);
    exit;
}

/* FETCH HTML */
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_USERAGENT => "Mozilla/5.0 (IPO App Bot)",
]);
$html = curl_exec($ch);
curl_close($ch);

if (!$html) {
    echo json_encode(["error" => "Failed to fetch HTML"]);
    exit;
}

/* LOAD DOM */
libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML($html);
$xpath = new DOMXPath($dom);

function clean($s) {
    return trim(preg_replace('/\s+/', ' ', $s));
}

$data = [];

/* BASIC (already working) */
$data['ipo_name'] = clean($xpath->query("//h2[contains(@class,'profile-username')]")->item(0)->textContent ?? '');
$data['dates']    = clean($xpath->query("//p[contains(@class,'text-muted')]")->item(0)->textContent ?? '');
$data['image']    = $xpath->query("//div[contains(@class,'box-profile')]//img")->item(0)->getAttribute("src") ?? '';

/* BASIC DETAILS */
$basic = [];
foreach ($xpath->query("//div[contains(@class,'box-profile')]//table//tr") as $r) {
    $td = $r->getElementsByTagName("td");
    $th = $r->getElementsByTagName("th");
    if ($td->length >= 2) $basic[clean($td->item(0)->textContent)] = clean($td->item(1)->textContent);
    if ($th->length >= 2) $basic[clean($th->item(0)->textContent)] = clean($th->item(1)->textContent);
}
$data['basic_details'] = $basic;

/* ================= MISSING ITEMS START ================= */

/* 1️⃣ DOCUMENTS (RHP / ANCHOR PDFs) */
$docs = [];
$seen = [];

foreach ($xpath->query("//div[contains(@class,'box-profile')]//a[contains(@href,'.pdf')]") as $a) {

    $url = $a->getAttribute("href");
    if (isset($seen[$url])) continue; // avoid duplicates

    $seen[$url] = true;

    $title = clean($a->textContent);
    if ($title === '') {
        $title = basename(parse_url($url, PHP_URL_PATH));
    }

    $docs[] = [
        "title" => $title,
        "url"   => $url
    ];
}

$data['documents'] = $docs;


/* 2️⃣ APPLICATION-WISE BREAKUP */
$application_breakup = [];

$table = $xpath->query(
    "//th[contains(.,'Application-Wise')]/ancestor::table"
)->item(0);

if ($table) {

    /* 1️⃣ HEADERS (real column headers) */
    $headers = [];
    foreach ($xpath->query(".//thead/tr[last()]/th", $table) as $th) {
        $headers[] = clean($th->textContent);
        // Category | Reserved | Applied | Times
    }

    /* 2️⃣ DATA ROWS */
    foreach ($xpath->query(".//tbody/tr", $table) as $r) {
        $td = $r->getElementsByTagName("td");

        if ($td->length === count($headers)) {
            $row = [];
            foreach ($headers as $i => $key) {
                $row[$key] = clean($td->item($i)->textContent);
            }
            $application_breakup[] = $row;
        }
    }
}

$data['application_breakup'] = $application_breakup;


/* 3️⃣ SUBSCRIPTION DEMAND */
$subscription_demand = [];

$table = $xpath->query(
    "//th[contains(.,'Subscription Demand')]/ancestor::table"
)->item(0);

if ($table) {

    /* 1️⃣ HEADERS (correct row) */
    $headers = [];
    foreach ($xpath->query(".//thead/tr[last()]/th", $table) as $th) {
        $headers[] = clean($th->textContent);
    }

    /* 2️⃣ ROWS */
    foreach ($xpath->query(".//tbody/tr", $table) as $r) {
        $td = $r->getElementsByTagName("td");

        if ($td->length === count($headers)) {
            $row = [];
            foreach ($headers as $i => $key) {
                $row[$key] = clean($td->item($i)->textContent);
            }
            $subscription_demand[] = $row;
        }
    }
}

$data['subscription_demand'] = $subscription_demand;






$subscription = [];

/* Get subscription card */
$table = $xpath->query(
    "//h2[contains(.,'Subscription')]/ancestor::div[contains(@class,'card')]//table[1]"
)->item(0);

if ($table) {

    /* 1️⃣ HEADERS */
    $headers = [];
    foreach ($xpath->query(".//thead/tr/th", $table) as $th) {
        $headers[] = clean($th->textContent);
        // Category | Offered | Applied | Times
    }

    /* 2️⃣ ROWS */
    foreach ($xpath->query(".//tbody/tr", $table) as $r) {
        $td = $r->getElementsByTagName("td");

        if ($td->length === count($headers)) {
            $row = [];
            foreach ($headers as $i => $key) {
                $row[$key] = clean($td->item($i)->textContent);
            }
            $subscription[] = $row;
        }
    }
}

$data['subscription'] = $subscription;




/* 4️⃣ QIB INTEREST */
$qib = [];
foreach ($xpath->query("//th[contains(.,'QIB Interest')]/ancestor::table//td") as $td) {
    $qib[] = clean($td->textContent);
}
$data['qib_interest'] = $qib;

/* 5️⃣ LOT DISTRIBUTION */
$lot_distribution = [];

$table = $xpath->query(
    "//h2[contains(.,'Lot')]/ancestor::div[contains(@class,'card')]//table"
)->item(0);

if ($table) {

    /* 1️⃣ HEADERS */
    $headers = [];
    foreach ($xpath->query(".//tr[1]/th", $table) as $th) {
        $headers[] = clean($th->textContent);
        // e.g. Category, Lot(s), Qty, Amount, Reserved
    }

    /* 2️⃣ ROWS */
    foreach ($xpath->query(".//tr[position()>1]", $table) as $r) {
        $td = $r->getElementsByTagName("td");

        if ($td->length === count($headers)) {
            $row = [];
            foreach ($headers as $i => $key) {
                $row[$key] = clean($td->item($i)->textContent);
            }
            $lot_distribution[] = $row;
        }
    }
}

$data['lot_distribution'] = $lot_distribution;


/* 6️⃣ RESERVATION */
$reservation = [];

$table = $xpath->query(
    "//h2[contains(.,'Reservation')]/ancestor::div[contains(@class,'card')]//table"
)->item(0);

if ($table) {

    /* 1️⃣ READ HEADERS */
    $headers = [];
    foreach ($xpath->query(".//tr[1]/th", $table) as $th) {
        $headers[] = clean($th->textContent);
        // e.g. Category, Shares Offered, %
    }

    /* 2️⃣ READ ROWS */
    foreach ($xpath->query(".//tr[position()>1]", $table) as $r) {
        $td = $r->getElementsByTagName("td");
        if ($td->length === count($headers)) {
            $row = [];
            foreach ($headers as $i => $key) {
                $row[$key] = clean($td->item($i)->textContent);
            }
            $reservation[] = $row;
        }
    }
}

$data['reservation'] = $reservation;


/* 7️⃣ IPO DETAILS (ABOUT → IPO DETAILS) */
$ipoDetails = [];
foreach ($xpath->query("//h5[contains(.,'IPO Details')]/following::table[1]//tr") as $r) {
    $td = $r->getElementsByTagName("td");
    if ($td->length >= 2) {
        $ipoDetails[clean($td->item(0)->textContent)] = clean($td->item(1)->textContent);
    }
}
$data['ipo_details'] = $ipoDetails;

$kpi = [];

$table = $xpath->query("//h5[contains(.,'KPI')]/following::table[1]")->item(0);

if ($table) {
    // 1. read header years
    $headers = [];
    foreach ($xpath->query(".//thead//th", $table) as $i => $th) {
        if ($i > 0) { // skip KPI column
            $headers[] = clean($th->textContent); // Sep-25, Mar-25, etc
        }
    }

    // 2. read rows
    foreach ($xpath->query(".//tbody//tr", $table) as $r) {
        $row = [];
        $th = $r->getElementsByTagName("th");
        $td = $r->getElementsByTagName("td");

        if ($th->length && $td->length) {
            $row['kpi'] = clean($th->item(0)->textContent);

            foreach ($td as $i => $cell) {
                if (isset($headers[$i])) {
                    $row[$headers[$i]] = clean($cell->textContent);
                }
            }

            $kpi[] = $row;
        }
    }
}

$data['kpi'] = $kpi;


/* 9️⃣ PEER COMPARISON (VALUATION) */
$peerVal = [];

$table = $xpath->query(
    "//span[contains(.,'Peer Comparison (Valuation)')]/following::table[1]"
)->item(0);

if ($table) {

    /* 1. READ HEADERS */
    $headers = [];
    foreach ($xpath->query(".//thead//th", $table) as $i => $th) {
        if ($i > 0) { // first column = Company
            $headers[] = clean($th->textContent); 
            // e.g. P/E (x), CMP*(₹), Face value (₹)
        }
    }

    /* 2. READ ROWS */
    foreach ($xpath->query(".//tbody//tr", $table) as $r) {
        $row = [];
        $th = $r->getElementsByTagName("th");
        $td = $r->getElementsByTagName("td");

        if ($th->length) {
            $row['company'] = clean($th->item(0)->textContent);

            foreach ($td as $i => $cell) {
                if (isset($headers[$i])) {
                    $row[$headers[$i]] = clean($cell->textContent);
                }
            }

            $peerVal[] = $row;
        }
    }
}

$data['peer_valuation'] = $peerVal;


/* 🔟 PEER COMPARISON (FINANCIAL) */
$peerFin = [];

$table = $xpath->query(
    "//span[contains(.,'Peer Comparison (Financial')]/following::table[1]"
)->item(0);

if ($table) {

    /* 1️⃣ READ HEADERS (skip first = Company) */
    $headers = [];
    foreach ($xpath->query(".//thead//th", $table) as $i => $th) {
        if ($i > 0) {
            $headers[] = clean($th->textContent);
            // e.g. RoNW (%), EPS (Basic) (₹)
        }
    }

    /* 2️⃣ READ ROWS */
    foreach ($xpath->query(".//tbody//tr", $table) as $r) {
        $row = [];
        $th  = $r->getElementsByTagName("th");
        $td  = $r->getElementsByTagName("td");

        if ($th->length) {
            $row['company'] = clean($th->item(0)->textContent);

            foreach ($td as $i => $cell) {
                if (isset($headers[$i])) {
                    $row[$headers[$i]] = clean($cell->textContent);
                }
            }

            $peerFin[] = $row;
        }
    }
}

$data['peer_financials'] = $peerFin;


/* 1️⃣1️⃣ ABOUT COMPANY TEXT */
$data['about_company'] = clean(
    $xpath->query("//h5[contains(.,'About Company')]/following-sibling::p")
          ->item(0)->textContent ?? ''
);

/* 1️⃣2️⃣ LEAD MANAGERS */
$lm = [];
foreach ($xpath->query("//h2[contains(.,'Lead Manager')]/ancestor::div[contains(@class,'card')]//a[contains(@href,'/lead-manager/')]") as $a) {
    $lm[] = [
        "name" => clean($a->textContent),
        // "url"  => $a->getAttribute("href")
    ];
}
$data['lead_managers'] = $lm;


/* ================= MISSING ITEMS END ================= */

/* ADDRESS + REGISTRAR (already present) */
$data['address'] = clean($xpath->query("//h2[contains(.,'Address')]/ancestor::div[contains(@class,'card')]//address")->item(0)->textContent ?? '');
$data['registrar'] = clean($xpath->query("//h2[contains(.,'Registrar')]/ancestor::div[contains(@class,'card')]")->item(0)->textContent ?? '');

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
