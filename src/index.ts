import { Hono } from 'hono';

const app = new Hono();

const uiTemplate = `
<!DOCTYPE html>
<html class="light" lang="ja">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Backlog User &amp; Project Extractor</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-low":"#f6f3f2","outline-variant":"#bccabe",
        "primary-fixed-dim":"#59de97","surface":"#fcf9f8",
        "tertiary-container":"#52ad94","surface-container-high":"#eae7e7",
        "outline":"#6d7a70","surface-container-lowest":"#ffffff",
        "surface-dim":"#dcd9d9","inverse-on-surface":"#f3f0ef",
        "on-background":"#1b1c1c","secondary-container":"#fd861c",
        "primary":"#006d41","secondary-fixed-dim":"#ffb786",
        "error-container":"#ffdad6","inverse-surface":"#303030",
        "secondary-fixed":"#ffdcc6","surface-container-highest":"#e4e2e1",
        "error":"#ba1a1a","surface-bright":"#fcf9f8",
        "on-surface-variant":"#3d4a40","surface-container":"#f0eded",
        "tertiary":"#006b57","primary-container":"#20b371",
        "on-error-container":"#93000a","surface-variant":"#e4e2e1",
        "on-surface":"#1b1c1c","on-primary":"#ffffff",
        "background":"#fcf9f8","secondary":"#954900",
        "primary-fixed":"#78fbb2","on-primary-fixed-variant":"#005230",
        "inverse-primary":"#59de97","surface-tint":"#006d41",
        "on-primary-container":"#003d23","on-secondary":"#ffffff",
        "on-tertiary":"#ffffff","on-error":"#ffffff",
        "on-secondary-container":"#612d00","on-tertiary-container":"#003d30",
        "on-primary-fixed":"#002110","on-secondary-fixed":"#311400",
        "on-tertiary-fixed":"#002019","on-secondary-fixed-variant":"#723600",
        "on-tertiary-fixed-variant":"#005141","tertiary-fixed":"#99f4d8",
        "tertiary-fixed-dim":"#7cd7bc"
      },
      borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
      spacing:{"margin-page":"40px","space-md":"16px","space-lg":"24px","space-sm":"8px","space-xs":"4px","space-xl":"48px","gutter":"24px","unit":"8px","container-max":"1200px"},
      fontFamily:{"label-md":["Manrope"],"body-lg":["Manrope"],"h2":["Manrope"],"h1":["Manrope"],"caption":["Manrope"],"body-md":["Manrope"]},
      fontSize:{
        "label-md":["14px",{"lineHeight":"20px","fontWeight":"600"}],
        "body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],
        "h2":["24px",{"lineHeight":"32px","letterSpacing":"-0.01em","fontWeight":"600"}],
        "h1":["32px",{"lineHeight":"40px","letterSpacing":"-0.02em","fontWeight":"700"}],
        "caption":["12px",{"lineHeight":"16px","fontWeight":"500"}],
        "body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}]
      }
    }
  }
}
</script>
<style>
body{font-family:'Manrope',sans-serif;background-color:#F7F4F1;}
.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;vertical-align:middle;}
.glass-card{background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);box-shadow:0px 4px 20px rgba(0,0,0,0.05);}
.shadow-level-1{box-shadow:0px 4px 20px rgba(0,0,0,0.05);}
html.dark body{background-color:#1a1a1a;}
table[style*="table-layout:fixed"] td{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
</style>
</head>
<body class="font-body-md text-on-surface">
<!-- TopNavBar -->
<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
<div class="flex justify-between items-center w-full px-6 py-3 max-w-[1200px] mx-auto">
<div class="flex items-center gap-8">
<span class="text-xl font-extrabold text-emerald-600 tracking-tight" data-i18n="title">Backlog ユーザー・プロジェクト抽出</span>
<nav class="hidden md:flex items-center gap-6 text-sm font-medium" id="main-nav">
<a href="#" class="nav-link text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors" data-nav="processing" data-i18n="navProcessing" style="display:none;">抽出中</a>
<a href="#" class="nav-link text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors" data-nav="results" data-i18n="navResults" style="display:none;">分析結果</a>
</nav>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center bg-surface-container-high rounded-full p-1">
<button id="lang-ja" class="px-3 py-1 text-[10px] font-bold rounded-full bg-white text-primary shadow-sm transition-all">JA</button>
<button id="lang-en" class="px-3 py-1 text-[10px] font-bold rounded-full text-outline hover:text-on-surface transition-all">EN</button>
</div>
<button id="dark-mode-toggle" class="material-symbols-outlined text-on-surface-variant hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">dark_mode</button>
</div>
</div>
</header>

<main class="max-w-[1200px] mx-auto px-6 py-12 min-h-[calc(100vh-120px)]">

<!-- ====== SCREEN: Dashboard (Input) ====== -->
<div id="screen-dashboard">
<div class="flex flex-col items-center">
<div class="text-center mb-space-xl max-w-2xl">
<h1 class="font-h1 text-h1 text-on-surface mb-space-sm" data-i18n="title">Backlog ユーザー・プロジェクト抽出</h1>
<p class="font-body-md text-body-md text-on-surface-variant" data-i18n="desc">スペースのユーザーおよびプロジェクトの参加状況を抽出します。</p>
</div>
<div class="w-full max-w-3xl glass-card rounded-xl p-space-lg">
<form id="extractForm" class="space-y-space-lg">
<div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
<div class="flex flex-col gap-space-xs">
<label class="font-label-md text-label-md text-on-surface" for="space-id" data-i18n="spaceId">スペースID</label>
<input class="w-full bg-white dark:bg-gray-800 border border-outline dark:border-gray-600 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md dark:text-white" id="space-id" placeholder="例: mycompany" data-i18n-placeholder="spaceIdPlaceholder" type="text" required/>
<span class="font-caption text-caption text-on-surface-variant" data-i18n="spaceIdHelp">BacklogのスペースIDを入力してください。</span>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-label-md text-label-md text-on-surface" for="domain" data-i18n="domain">ドメイン</label>
<select class="w-full bg-white dark:bg-gray-800 border border-outline dark:border-gray-600 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md appearance-none dark:text-white" id="domain">
<option value="backlog.jp">backlog.jp</option>
<option value="backlog.com">backlog.com</option>
<option value="backlogtool.com">backlogtool.com</option>
</select>
</div>
</div>
<div class="flex flex-col gap-space-xs pt-2">
<label class="font-label-md text-label-md text-on-surface" for="api-key" data-i18n="apiKey">APIキー</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">key</span>
<input class="w-full bg-white dark:bg-gray-800 border border-outline dark:border-gray-600 pl-12 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md dark:text-white" id="api-key" placeholder="Backlog APIキーを入力" data-i18n-placeholder="apiKeyPlaceholder" type="password" required/>
</div>
<div class="mt-space-sm bg-surface-container dark:bg-gray-800 p-4 rounded-lg flex gap-space-sm items-start">
<span class="material-symbols-outlined text-emerald-600 shrink-0">info</span>
<p class="font-caption text-on-surface-variant" data-i18n="apiKeyHelp">Backlogの個人設定 > API からAPIキーを生成・コピーしてください。</p>
</div>
</div>
<div class="flex flex-col items-center pt-space-md">
<button class="w-full md:w-auto min-w-[240px] bg-primary-container hover:bg-on-primary-fixed-variant text-white px-space-lg py-3 rounded-lg font-label-md flex items-center justify-center gap-2 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0" type="submit" id="search-button">
<span class="material-symbols-outlined">database_upload</span>
<span data-i18n="execBtn">抽出実行</span>
</button>
</div>
</form>
</div>
<div id="error-message" class="mt-6 w-full max-w-3xl bg-error-container text-on-error-container p-4 rounded-lg font-label-md" style="display:none;"></div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-lg w-full mt-space-xl">
<div class="glass-card p-space-lg rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4"><span class="material-symbols-outlined text-emerald-600">groups</span></div>
<h3 class="font-label-md text-on-surface mb-2" data-i18n="featureAudit">メンバー監査</h3>
<p class="font-caption text-on-surface-variant" data-i18n="featureAuditDesc">全プロジェクトのユーザー一覧をロール・ステータス付きで取得</p>
</div>
<div class="glass-card p-space-lg rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4"><span class="material-symbols-outlined text-emerald-600">folder_managed</span></div>
<h3 class="font-label-md text-on-surface mb-2" data-i18n="featureInsights">プロジェクト分析</h3>
<p class="font-caption text-on-surface-variant" data-i18n="featureInsightsDesc">アクティブ・アーカイブ済みプロジェクトの詳細サマリー</p>
</div>
<div class="glass-card p-space-lg rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4"><span class="material-symbols-outlined text-emerald-600">export_notes</span></div>
<h3 class="font-label-md text-on-surface mb-2" data-i18n="featureExport">CSV エクスポート</h3>
<p class="font-caption text-on-surface-variant" data-i18n="featureExportDesc">抽出データを構造化されたCSV形式で即座にダウンロード</p>
</div>
</div>
</div>
</div>

<!-- ====== SCREEN: Processing ====== -->
<div id="screen-processing" style="display:none;">
<div class="mb-12 text-center">
<h1 class="font-h1 text-h1 text-on-surface mb-2" data-i18n="loadingTitle">データの抽出中...</h1>
<p class="font-body-md text-on-surface-variant" data-i18n="loadingDesc">抽出完了までしばらくお待ちください。</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<div class="md:col-span-8 bg-surface-container-lowest dark:bg-gray-800 rounded-xl p-8 shadow-level-1 flex flex-col items-center justify-center border border-surface-container">
<div class="relative flex items-center justify-center mb-8">
<svg class="w-48 h-48 transform -rotate-90">
<circle class="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="8"></circle>
<circle id="progress-circle" class="text-primary-container" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-dasharray="552.92" stroke-dashoffset="552.92" stroke-width="8" style="transition:stroke-dashoffset 0.5s ease;"></circle>
</svg>
<div class="absolute flex flex-col items-center">
<span class="font-h1 text-primary text-4xl" id="progress-pct">0%</span>
<span class="font-caption text-outline" id="progress-count">0 / 0</span>
</div>
</div>
<div class="w-full max-w-md">
<div class="flex justify-between items-end mb-2">
<span class="font-label-md text-on-surface" data-i18n="overallProgress">全体の進捗</span>
<span class="font-caption text-outline" id="progress-remaining"></span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div id="progress-bar" class="bg-primary-container h-full rounded-full" style="width:0%;transition:width 0.5s ease;"></div>
</div>
</div>
</div>
<div class="md:col-span-4 bg-surface-container-lowest dark:bg-gray-800 rounded-xl p-6 shadow-level-1 border border-surface-container flex flex-col">
<h3 class="font-label-md text-on-surface mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-primary">list_alt</span> <span data-i18n="activityLog">アクティビティログ</span></h3>
<div class="space-y-4 overflow-y-auto max-h-[300px] pr-2" id="activity-log"></div>
</div>
<div class="md:col-span-12 bg-white dark:bg-gray-800 rounded-xl p-6 border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center">
<div class="flex-shrink-0 w-24 h-24 bg-surface-container-low rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-4xl">database</span>
</div>
<div class="flex-grow grid grid-cols-2 md:grid-cols-3 gap-6">
<div><span class="block font-caption text-outline mb-1 uppercase tracking-wider" data-i18n="rateLimitLabel">API制限</span><span class="font-label-md text-on-surface" id="rate-limit-value">--/--</span></div>
<div><span class="block font-caption text-outline mb-1 uppercase tracking-wider" data-i18n="rateLimitReset">リセット</span><span class="font-label-md text-on-surface" id="rate-limit-reset">--:--</span></div>
<div><span class="block font-caption text-outline mb-1 uppercase tracking-wider" data-i18n="startTime">開始時刻</span><span class="font-label-md text-on-surface" id="start-time">--:--</span></div>
</div>
</div>
</div>
</div>
<!-- ====== SCREEN: Results ====== -->
<div id="screen-results" style="display:none;">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 class="font-h1 text-h1 text-on-surface mb-2" data-i18n="resultsTitle">分析結果</h1>
<p class="font-body-md text-on-surface-variant max-w-2xl" data-i18n="resultsDesc">Backlogスペースからユーザー・プロジェクトデータの抽出が完了しました。</p>
</div>
<div class="flex flex-wrap gap-3">
<button id="download-users-btn" class="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-md hover:bg-primary shadow-sm transition-all">
<span class="material-symbols-outlined">csv</span><span data-i18n="downloadUsersCsv">ユーザーCSV</span>
</button>
<button id="download-projects-btn" class="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-label-md hover:bg-on-primary-fixed-variant shadow-sm transition-all">
<span class="material-symbols-outlined">csv</span><span data-i18n="downloadProjectsCsv">プロジェクトCSV</span>
</button>
<button id="extract-new-btn" class="flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg font-label-md hover:bg-primary-fixed/20 transition-all">
<span class="material-symbols-outlined">refresh</span><span data-i18n="extractNew">新規抽出</span>
</button>
</div>
</div>
<!-- Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" id="summary-cards">
<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-level-1 border border-gray-100 dark:border-gray-700 flex items-center gap-5">
<div class="h-12 w-12 bg-primary-fixed-dim rounded-lg flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[28px]">groups</span></div>
<div><p class="text-caption text-on-surface-variant uppercase tracking-wider" data-i18n="totalUsers">ユーザー数</p><p class="text-h2 font-h2 text-on-surface" id="stat-users">0</p></div>
</div>
<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-level-1 border border-gray-100 dark:border-gray-700 flex items-center gap-5">
<div class="h-12 w-12 bg-secondary-fixed-dim rounded-lg flex items-center justify-center text-on-secondary-container"><span class="material-symbols-outlined text-[28px]">assignment</span></div>
<div><p class="text-caption text-on-surface-variant uppercase tracking-wider" data-i18n="totalProjects">プロジェクト数</p><p class="text-h2 font-h2 text-on-surface" id="stat-projects">0</p></div>
</div>
<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-level-1 border border-gray-100 dark:border-gray-700 flex items-center gap-5">
<div class="h-12 w-12 bg-tertiary-fixed-dim rounded-lg flex items-center justify-center text-on-tertiary-container"><span class="material-symbols-outlined text-[28px]">verified_user</span></div>
<div><p class="text-caption text-on-surface-variant uppercase tracking-wider" data-i18n="extractionHealth">抽出状態</p><p class="text-h2 font-h2 text-on-surface" id="stat-health">100%</p></div>
</div>
</div>
<!-- Data Table -->
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-level-1 border border-gray-100 dark:border-gray-700 overflow-hidden">
<div class="flex items-center px-8 border-b border-surface-container-high">
<button class="tab py-5 px-6 font-label-md border-b-2 border-primary text-primary" data-tab="tab-users" data-i18n="tabUsers">ユーザー一覧</button>
<button class="tab py-5 px-6 font-label-md text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent" data-tab="tab-projects" data-i18n="tabProjects">プロジェクト一覧</button>
<div class="ml-auto flex items-center gap-4 py-3">
<div class="relative" id="search-container-users">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input id="userEmailSearch" class="pl-10 pr-4 py-2 bg-surface-container-low dark:bg-gray-700 border border-outline-variant/50 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="メールアドレスで検索..." data-i18n-placeholder="searchEmail" type="text"/>
</div>
<div class="relative" id="search-container-projects" style="display:none;">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input id="projectKeySearch" class="pl-10 pr-4 py-2 bg-surface-container-low dark:bg-gray-700 border border-outline-variant/50 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="プロジェクトキーで検索..." data-i18n-placeholder="searchProject" type="text"/>
</div>
<select id="userPerPage" class="py-2 px-3 bg-surface-container-low dark:bg-gray-700 border border-outline-variant/50 dark:border-gray-600 rounded-lg text-sm outline-none dark:text-white">
<option value="20" data-i18n="show20">20件</option><option value="50" data-i18n="show50">50件</option><option value="100" data-i18n="show100">100件</option>
</select>
<select id="projectPerPage" class="py-2 px-3 bg-surface-container-low dark:bg-gray-700 border border-outline-variant/50 dark:border-gray-600 rounded-lg text-sm outline-none dark:text-white" style="display:none;">
<option value="20" data-i18n="show20">20件</option><option value="50" data-i18n="show50">50件</option><option value="100" data-i18n="show100">100件</option>
</select>
</div>
</div>
<!-- Users Table -->
<div id="tab-users" class="tab-content">
<div class="overflow-x-auto">
<table class="w-full text-left" style="table-layout:fixed;">
<thead><tr class="sortable-headers bg-surface-container-lowest dark:bg-gray-900 border-b border-surface-container-high" data-type="user">
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:18%;" data-sort="name"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colName">名前</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:22%;" data-sort="mailAddress"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colEmail">メールアドレス</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:10%;" data-sort="roleName"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colRole">権限</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:18%;" data-sort="nulabAccountName"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colNulab">Nulabアカウント</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:20%;" data-sort="lastLoginTimeJST"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colLastLogin">最終ログイン</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant text-center" style="width:12%;" data-sort="joinedProjectCount"><div class="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colJoinedProjs">参加PJ数</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
</tr></thead>
<tbody id="users-tbody" class="divide-y divide-surface-container-high"></tbody>
</table>
</div>
<div id="userPagination" class="px-8 py-6 flex justify-center items-center gap-2"></div>
</div>
<!-- Projects Table -->
<div id="tab-projects" class="tab-content" style="display:none;">
<div class="overflow-x-auto">
<table class="w-full text-left" style="table-layout:fixed;">
<thead><tr class="sortable-headers bg-surface-container-lowest dark:bg-gray-900 border-b border-surface-container-high" data-type="project">
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:15%;" data-sort="projectKey"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colProjKey">プロジェクトキー</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant" style="width:35%;" data-sort="name"><div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colProjName">プロジェクト名</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant text-center" style="width:14%;" data-sort="archived"><div class="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colArchived">状態</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant text-center" style="width:14%;" data-sort="userCount"><div class="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colUsers">ユーザー数</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
<th class="px-6 py-4 font-label-md text-on-surface-variant text-center" style="width:14%;" data-sort="teamCount"><div class="flex items-center justify-center gap-1 cursor-pointer hover:text-primary transition-colors"><span data-i18n="colTeams">チーム数</span><span class="material-symbols-outlined text-sm opacity-50 sort-icon">swap_vert</span></div></th>
</tr></thead>
<tbody id="projects-tbody" class="divide-y divide-surface-container-high"></tbody>
</table>
</div>
<div id="projectPagination" class="px-8 py-6 flex justify-center items-center gap-2"></div>
</div>
</div>
</div>
</main>

<!-- Modal -->
<div id="detail-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" style="display:none;">
<div class="bg-white dark:bg-gray-800 w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
<div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
<h2 class="text-h2 font-h2 text-on-surface" id="modal-title">詳細</h2>
<button class="close material-symbols-outlined text-on-surface-variant hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">close</button>
</div>
<div id="modal-body" class="flex-grow overflow-y-auto px-6 py-6"></div>
<div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
<button class="close-modal px-6 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary-container transition-colors shadow-sm" data-i18n="closeBtn">閉じる</button>
</div>
</div>
</div>

<!-- Footer -->
<footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
<div class="max-w-[1200px] mx-auto py-6 px-6 text-center">
<span class="font-bold text-gray-900 dark:text-white">Backlog Utility</span>
<p class="font-caption text-gray-500 mt-1">© 2024 Backlog Utility.</p>
</div>
</footer>
<script>
const state = {
    darkMode: localStorage.getItem('darkMode') === 'true',
    users: [], projects: [], teamAvailable: true,
    credentials: { spaceId: '', domain: '', apiKey: '' },
    rateLimit: null, filters: { userEmail: '', projectKey: '' },
    pagination: { user: { page: 1, perPage: 20 }, project: { page: 1, perPage: 20 } },
    sort: { user: { key: 'name', asc: true }, project: { key: 'projectKey', asc: true } },
    currentScreen: 'dashboard'
};

const t = {
    ja: {
        title:"Backlog ユーザー・プロジェクト抽出", desc:"スペースのユーザーおよびプロジェクトの参加状況を抽出します。",
        navDashboard:"ダッシュボード", navProcessing:"抽出中", navResults:"分析結果",
        spaceId:"スペースID", spaceIdPlaceholder:"例: mycompany", spaceIdHelp:"BacklogのスペースIDを入力してください。",
        domain:"ドメイン", apiKey:"APIキー", apiKeyPlaceholder:"Backlog APIキーを入力",
        apiKeyHelp:"Backlogの個人設定 > API からAPIキーを生成・コピーしてください。",
        execBtn:"抽出実行", loadingTitle:"データの抽出中...", loadingDesc:"抽出完了までしばらくお待ちください。",
        overallProgress:"全体の進捗", activityLog:"アクティビティログ",
        rateLimitLabel:"API制限", rateLimitReset:"リセット", startTime:"開始時刻",
        resultsTitle:"分析結果", resultsDesc:"Backlogスペースからユーザー・プロジェクトデータの抽出が完了しました。",
        totalUsers:"ユーザー数", totalProjects:"プロジェクト数", extractionHealth:"抽出状態",
        tabUsers:"ユーザー一覧", tabProjects:"プロジェクト一覧",
        searchEmail:"メールアドレスで検索...", searchProject:"プロジェクトキーで検索...",
        show20:"20件", show50:"50件", show100:"100件",
        downloadUsersCsv:"ユーザーCSV", downloadProjectsCsv:"プロジェクトCSV", extractNew:"新規抽出",
        colName:"名前", colEmail:"メールアドレス", colNulab:"Nulabアカウント", colRole:"権限",
        colLastLogin:"最終ログイン", colJoinedProjs:"参加PJ数",
        colProjKey:"プロジェクトキー", colProjName:"プロジェクト名", colArchived:"状態",
        colUsers:"ユーザー数", colTeams:"チーム数",
        closeBtn:"閉じる", yes:"あり", no:"なし",
        prev:"前へ", next:"次へ",
        userProjsTitle:" が参加しているプロジェクト ({count}件)",
        projUsersTitle:" のメンバー ({count}名)",
        projTeamsTitle:" のチーム ({count}件)",
        teamUsersTitle:" のメンバー ({count}名)",
        teamName:"チーム名", members:"人数", updated:"更新日",
        featureAudit:"メンバー監査", featureAuditDesc:"全プロジェクトのユーザー一覧をロール・ステータス付きで取得",
        featureInsights:"プロジェクト分析", featureInsightsDesc:"アクティブ・アーカイブ済みプロジェクトの詳細サマリー",
        featureExport:"CSV エクスポート", featureExportDesc:"抽出データを構造化されたCSV形式で即座にダウンロード",
        logUsersDone:"ユーザーリストの取得完了", logPermCheck:"プロジェクト権限の確認完了",
        logFetching:"プロジェクトデータの取得中...", logPending:"残りプロジェクトの取得",
        active:"アクティブ", archived:"アーカイブ済", loading:"取得中...",
        projAdmin:"管理者", memberLabel:"メンバー"
    },
    en: {
        title:"Backlog User & Project Extractor", desc:"Extracts user and project participation status in the space.",
        navDashboard:"Dashboard", navProcessing:"Processing", navResults:"Results",
        spaceId:"Space ID", spaceIdPlaceholder:"e.g. mycompany", spaceIdHelp:"Enter your Backlog space ID.",
        domain:"Domain", apiKey:"API Key", apiKeyPlaceholder:"Enter Backlog API Key",
        apiKeyHelp:"Navigate to Backlog User Settings > API to generate your key.",
        execBtn:"Execute", loadingTitle:"Extracting Data...", loadingDesc:"Please wait while extraction completes.",
        overallProgress:"Overall Progress", activityLog:"Activity Log",
        rateLimitLabel:"API Limit", rateLimitReset:"Reset", startTime:"Start Time",
        resultsTitle:"Extraction Results", resultsDesc:"Successfully extracted user & project data from your Backlog space.",
        totalUsers:"Total Users", totalProjects:"Total Projects", extractionHealth:"Health",
        tabUsers:"Users", tabProjects:"Projects",
        searchEmail:"Search by email...", searchProject:"Search by project key...",
        show20:"20", show50:"50", show100:"100",
        downloadUsersCsv:"Users CSV", downloadProjectsCsv:"Projects CSV", extractNew:"Extract New",
        colName:"Name", colEmail:"Email", colNulab:"Nulab Account", colRole:"Role",
        colLastLogin:"Last Login", colJoinedProjs:"Projects",
        colProjKey:"Project Key", colProjName:"Project Name", colArchived:"Status",
        colUsers:"Users", colTeams:"Teams",
        closeBtn:"Close", yes:"Yes", no:"No",
        prev:"Prev", next:"Next",
        userProjsTitle:"'s Joined Projects ({count})",
        projUsersTitle:"'s Members ({count})",
        projTeamsTitle:"'s Teams ({count})",
        teamUsersTitle:"'s Members ({count})",
        teamName:"Team Name", members:"Members", updated:"Updated",
        featureAudit:"Member Audit", featureAuditDesc:"Complete user list across all projects with role and status.",
        featureInsights:"Project Insights", featureInsightsDesc:"Detailed summaries of active and archived projects.",
        featureExport:"CSV Export", featureExportDesc:"Download your data in structured CSV formats instantly.",
        logUsersDone:"User list fetched", logPermCheck:"Permissions verified",
        logFetching:"Fetching project data...", logPending:"Remaining projects",
        active:"Active", archived:"Archived", loading:"Loading...",
        projAdmin:"Admin", memberLabel:"Member"
    }
};

let currentLang = localStorage.getItem('lang') || 'ja';
const getT = (key, params={}) => { let str = t[currentLang][key] || key; for(const [k,v] of Object.entries(params)) str = str.replace('{'+k+'}', v); return str; };
function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(t[currentLang][k]) el.textContent = t[currentLang][k]; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.getAttribute('data-i18n-placeholder'); if(t[currentLang][k]) el.placeholder = t[currentLang][k]; });
}
function switchScreen(name) {
    state.currentScreen = name;
    ['dashboard','processing','results'].forEach(s => { const el = document.getElementById('screen-'+s); if(el) el.style.display = s===name?'block':'none'; });
    document.querySelectorAll('.nav-link').forEach(a => {
        const nav = a.dataset.nav;
        if(nav === name) { a.className = 'nav-link text-emerald-600 border-b-2 border-emerald-600 pb-1'; a.style.display = ''; }
        else if(nav === 'processing' && name !== 'processing') { a.style.display = 'none'; }
        else if(nav === 'results' && name === 'dashboard') { a.style.display = 'none'; }
        else { a.className = 'nav-link text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors'; a.style.display = ''; }
    });
}
if(state.darkMode) document.documentElement.classList.add('dark');
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    state.darkMode = !state.darkMode; localStorage.setItem('darkMode', state.darkMode);
    document.documentElement.classList.toggle('dark', state.darkMode);
});
function setLangUI() {
    const ja = document.getElementById('lang-ja'), en = document.getElementById('lang-en');
    if(currentLang==='ja') { ja.className='px-3 py-1 text-[10px] font-bold rounded-full bg-white text-primary shadow-sm transition-all'; en.className='px-3 py-1 text-[10px] font-bold rounded-full text-outline hover:text-on-surface transition-all'; }
    else { en.className='px-3 py-1 text-[10px] font-bold rounded-full bg-white text-primary shadow-sm transition-all'; ja.className='px-3 py-1 text-[10px] font-bold rounded-full text-outline hover:text-on-surface transition-all'; }
}
setLangUI(); updateI18n();
document.getElementById('lang-ja').addEventListener('click', () => { currentLang='ja'; localStorage.setItem('lang','ja'); setLangUI(); updateI18n(); if(state.currentScreen==='results'){renderUsers();renderProjects();} });
document.getElementById('lang-en').addEventListener('click', () => { currentLang='en'; localStorage.setItem('lang','en'); setLangUI(); updateI18n(); if(state.currentScreen==='results'){renderUsers();renderProjects();} });
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => { t.classList.remove('border-primary','text-primary'); t.classList.add('border-transparent','text-on-surface-variant'); });
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        tab.classList.remove('border-transparent','text-on-surface-variant'); tab.classList.add('border-primary','text-primary');
        const target = tab.dataset.tab;
        document.getElementById(target).style.display = 'block';
        const isUsers = target === 'tab-users';
        document.getElementById('search-container-users').style.display = isUsers?'':'none';
        document.getElementById('search-container-projects').style.display = isUsers?'none':'';
        document.getElementById('userPerPage').style.display = isUsers?'':'none';
        document.getElementById('projectPerPage').style.display = isUsers?'none':'';
    });
});
const modal = document.getElementById('detail-modal');
function closeModal() { modal.style.display = 'none'; }
document.querySelector('.close').onclick = closeModal;
document.querySelector('.close-modal').onclick = closeModal;
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
function openModal(title, htmlContent) { document.getElementById('modal-title').textContent = title; document.getElementById('modal-body').innerHTML = htmlContent; modal.style.display = 'flex'; }
function addActivityLog(text, status) {
    const log = document.getElementById('activity-log');
    const icon = status==='done'?'check_circle':status==='active'?'':'pending';
    const iconClass = status==='done'?'text-primary-container':status==='active'?'text-primary':'text-outline opacity-40';
    const textClass = status==='active'?'text-primary font-bold':'text-on-surface';
    const time = new Date().toLocaleTimeString('ja-JP');
    let html = '<div class="flex items-start gap-3 '+(status==='pending'?'opacity-40':'')+'">';
    if(status==='active') html += '<div class="w-4 h-4 mt-1 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>';
    else html += '<span class="material-symbols-outlined '+iconClass+' text-sm mt-1" style="'+(status==='done'?"font-variation-settings:\\\\'FILL\\\\' 1;":"")+'">'+icon+'</span>';
    html += '<div class="flex flex-col"><span class="font-label-md '+textClass+' text-sm">'+text+'</span><span class="font-caption text-outline">'+(status==='pending'?getT('logPending'):time)+'</span></div></div>';
    log.innerHTML += html;
}
function updateProgress(loaded, total) {
    const pct = total > 0 ? Math.round((loaded/total)*100) : 0;
    document.getElementById('progress-pct').textContent = pct+'%';
    document.getElementById('progress-count').textContent = loaded+' / '+total;
    document.getElementById('progress-bar').style.width = pct+'%';
    const circ = document.getElementById('progress-circle');
    circ.setAttribute('stroke-dashoffset', String(552.92 - (552.92*pct/100)));
}
function updateRateLimit(rl) {
    if(!rl || !rl.read) return;
    document.getElementById('rate-limit-value').textContent = rl.read.remaining+' / '+rl.read.limit;
    document.getElementById('rate-limit-reset').textContent = new Date(rl.read.reset*1000).toLocaleTimeString('ja-JP');
}
</script>
<script>
function renderUserRow(u) {
    const nulabStr = u.nulabAccountName ? getT('yes')+' ('+u.nulabAccountName+')' : getT('no');
    return '<tr class="hover:bg-surface dark:hover:bg-gray-700/50 transition-colors cursor-pointer" data-user-id="'+u.id+'">'
        +'<td class="px-6 py-4 font-label-md text-on-surface">'+u.name+'</td>'
        +'<td class="px-8 py-4 text-on-surface-variant">'+(u.mailAddress||'')+'</td>'
        +'<td class="px-8 py-4"><span class="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-caption">'+(u.roleName||'')+'</span></td>'
        +'<td class="px-8 py-4 text-on-surface-variant">'+nulabStr+'</td>'
        +'<td class="px-8 py-4 text-on-surface-variant">'+(u.lastLoginTimeJST||'')+'</td>'
        +'<td class="px-8 py-4 text-on-surface-variant text-center"><span class="cursor-pointer hover:text-primary transition-colors user-projects-link" data-uid="'+u.id+'">'+(u.joinedProjectCount||0)+'</span></td></tr>';
}
function renderProjectRow(p) {
    const stLabel = p.archived?getT('archived'):getT('active');
    const stClass = p.archived?'bg-surface-variant text-on-surface-variant':'bg-primary-fixed text-on-primary-fixed-variant';
    const loadingStr = p._loaded ? '' : '<span class="text-caption text-outline">('+getT('loading')+')</span>';
    return '<tr class="hover:bg-surface dark:hover:bg-gray-700/50 transition-colors cursor-pointer" data-project-id="'+p.id+'">'
        +'<td class="px-8 py-4 font-mono text-caption text-on-surface-variant">'+(p.projectKey||'')+'</td>'
        +'<td class="px-8 py-4"><span class="font-label-md text-on-surface">'+p.name+'</span> '+loadingStr+'</td>'
        +'<td class="px-8 py-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold '+stClass+'">'+stLabel+'</span></td>'
        +'<td class="px-8 py-4 text-on-surface-variant text-center">'+(p._loaded?(p.users||[]).length:'--')+'</td>'
        +'<td class="px-8 py-4 text-on-surface-variant text-center">'+(p._loaded?(p.teamCount||0):'--')+'</td></tr>';
}
function sortData(arr, key, asc) {
    return [...arr].sort((a,b)=>{let va=a[key],vb=b[key]; if(typeof va==='string')va=va.toLowerCase(); if(typeof vb==='string')vb=vb.toLowerCase(); if(va<vb)return asc?-1:1; if(va>vb)return asc?1:-1; return 0;});
}
function paginate(arr, page, perPage) { const start = (page-1)*perPage; return arr.slice(start, start+perPage); }
function renderPagination(containerId, total, page, perPage, onPage) {
    const pages = Math.ceil(total/perPage); const c = document.getElementById(containerId); if(!c) return; if(pages <= 1){c.innerHTML=''; return;}
    let h = '<button class="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface transition-colors'+(page<=1?' opacity-30 cursor-default':'')+'" '+(page<=1?'disabled':'')+' data-page="'+(page-1)+'"><span class="material-symbols-outlined">chevron_left</span></button>';
    for(let i=1;i<=pages;i++){if(pages>7&&i>3&&i<pages-1&&Math.abs(i-page)>1){if(i===4||i===pages-2)h+='<span class="px-2 text-on-surface-variant">...</span>';continue;}
    h+='<button class="w-10 h-10 rounded-lg font-label-md '+(i===page?'bg-primary text-white':'border border-outline-variant hover:bg-surface text-on-surface transition-colors')+'" data-page="'+i+'">'+i+'</button>';}
    h += '<button class="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface transition-colors'+(page>=pages?' opacity-30 cursor-default':'')+'" '+(page>=pages?'disabled':'')+' data-page="'+(page+1)+'"><span class="material-symbols-outlined">chevron_right</span></button>';
    c.innerHTML = h; c.querySelectorAll('button[data-page]').forEach(b=>b.addEventListener('click',()=>{const p=parseInt(b.dataset.page);if(p>=1&&p<=pages)onPage(p);}));
}
function renderUsers() {
    let filtered = state.users.filter(u=>!state.filters.userEmail||(u.mailAddress&&u.mailAddress.toLowerCase().includes(state.filters.userEmail)));
    filtered = sortData(filtered, state.sort.user.key, state.sort.user.asc);
    const paged = paginate(filtered, state.pagination.user.page, state.pagination.user.perPage);
    document.getElementById('users-tbody').innerHTML = paged.map(renderUserRow).join('');
    renderPagination('userPagination',filtered.length,state.pagination.user.page,state.pagination.user.perPage,p=>{state.pagination.user.page=p;renderUsers();});
    document.querySelectorAll('#users-tbody tr[data-user-id]').forEach(tr=>tr.addEventListener('click',()=>{showUserDetail(parseInt(tr.dataset.userId));}));
}
function renderProjects() {
    let filtered = state.projects.filter(p=>!state.filters.projectKey||(p.projectKey&&p.projectKey.toLowerCase().includes(state.filters.projectKey)));
    filtered = sortData(filtered, state.sort.project.key, state.sort.project.asc);
    const paged = paginate(filtered, state.pagination.project.page, state.pagination.project.perPage);
    document.getElementById('projects-tbody').innerHTML = paged.map(renderProjectRow).join('');
    renderPagination('projectPagination',filtered.length,state.pagination.project.page,state.pagination.project.perPage,p=>{state.pagination.project.page=p;renderProjects();});
    document.querySelectorAll('#projects-tbody tr[data-project-id]').forEach(tr=>tr.addEventListener('click',()=>{showProjectDetail(parseInt(tr.dataset.projectId));}));
}
document.querySelectorAll('.sortable-headers th[data-sort]').forEach(th=>{
    th.addEventListener('click',()=>{
        const type = th.closest('tr').dataset.type;
        const key = th.dataset.sort;
        const s = state.sort[type];
        if(s.key===key) s.asc=!s.asc; else { s.key=key; s.asc=true; }
        th.closest('tr').querySelectorAll('.sort-icon').forEach(i=>{ i.textContent='swap_vert'; i.classList.add('opacity-50'); });
        const icon = th.querySelector('.sort-icon'); icon.textContent = s.asc?'arrow_upward':'arrow_downward'; icon.classList.remove('opacity-50');
        if(type==='user') renderUsers(); else renderProjects();
    });
});
document.getElementById('userEmailSearch').addEventListener('input',e=>{state.filters.userEmail=e.target.value.toLowerCase();state.pagination.user.page=1;renderUsers();});
document.getElementById('projectKeySearch').addEventListener('input',e=>{state.filters.projectKey=e.target.value.toLowerCase();state.pagination.project.page=1;renderProjects();});
document.getElementById('userPerPage').addEventListener('change',e=>{state.pagination.user.perPage=parseInt(e.target.value);state.pagination.user.page=1;renderUsers();});
document.getElementById('projectPerPage').addEventListener('change',e=>{state.pagination.project.perPage=parseInt(e.target.value);state.pagination.project.page=1;renderProjects();});

function showUserDetail(uid) {
    const u = state.users.find(x=>x.id===uid); if(!u) return;
    const projs = u.joinedProjects || [];
    let h = '<div class="space-y-3">';
    projs.forEach(p=>{
        h+='<div class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">'
          +'<div class="flex items-center gap-3"><div class="h-8 w-8 bg-primary-container/20 rounded-md flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">folder</span></div>'
          +'<div><p class="font-label-md text-on-surface">'+p.name+'</p><p class="text-caption text-on-surface-variant font-mono">'+p.projectKey+'</p></div></div></div>';
    });
    h += '</div>';
    openModal(u.name + getT('userProjsTitle',{count:projs.length}), h);
}
function showProjectDetail(pid) {
    const p = state.projects.find(x=>x.id===pid); if(!p||!p._loaded) return;
    const users = p.users || []; const teams = p.teams || [];
    let h = '<div class="mb-4 bg-surface-container-low dark:bg-gray-700 p-4 rounded-lg flex gap-8"><div><p class="text-caption uppercase tracking-wider text-on-surface-variant">Project Key</p><p class="font-mono font-label-md">'+(p.projectKey||'')+'</p></div></div>';
    if(users.length>0){
        h+='<h3 class="text-caption font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">groups</span>'+getT('projUsersTitle',{count:users.length})+'</h3><div class="space-y-3 mb-6">';
        users.forEach(u=>{
            const initials = (u.name||'').split(/\\\\s+/).map(w=>w.charAt(0)).join('').substring(0,2).toUpperCase()||'?';
            const isAdmin = (p.adminUserIds||[]).includes(u.id);
            const roleLabel = isAdmin?getT('projAdmin'):getT('memberLabel');
            const roleCls = isAdmin?'bg-primary text-on-primary':'bg-primary-fixed text-on-primary-fixed-variant';
            h+='<div class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"><div class="flex items-center gap-3"><div class="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">'+initials+'</div><div><p class="font-label-md text-on-surface">'+u.name+'</p><p class="text-caption text-on-surface-variant">'+(u.mailAddress||'')+'</p></div></div><span class="px-2.5 py-0.5 rounded-full text-caption font-bold '+roleCls+'">'+roleLabel+'</span></div>';
        });
        h+='</div>';
    }
    if(teams.length>0&&state.teamAvailable){
        h+='<h3 class="text-caption font-bold text-on-surface-variant uppercase tracking-widest mb-3">'+getT('projTeamsTitle',{count:teams.length})+'</h3><div class="space-y-3">';
        teams.forEach(tm=>{
            h+='<div class="p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onclick="showTeamMembers('+p.id+','+tm.id+')">'
              +'<div class="flex items-center justify-between"><span class="font-label-md text-on-surface">'+tm.name+'</span><span class="text-caption text-on-surface-variant">'+(tm.memberCount||0)+' '+getT('members')+'</span></div></div>';
        });
        h+='</div>';
    }
    openModal(p.name, h);
}
async function showTeamMembers(pid, tid) {
    try {
        const res = await fetch('/api/team/members',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...state.credentials,projectId:pid,teamId:tid})});
        const data = await res.json();
        if(!res.ok) throw new Error(data.error);
        let h='<div class="space-y-3">';
        (data.members||[]).forEach(u=>{
            const initials=(u.name||'').split(/\\\\s+/).map(w=>w.charAt(0)).join('').substring(0,2).toUpperCase()||'?';
            h+='<div class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-600"><div class="h-10 w-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold">'+initials+'</div><div><p class="font-label-md text-on-surface">'+u.name+'</p><p class="text-caption text-on-surface-variant">'+(u.mailAddress||'')+'</p></div></div>';
        });
        h+='</div>';
        openModal(data.teamName+getT('teamUsersTitle',{count:(data.members||[]).length}), h);
    } catch(e) { console.error(e); }
}
window.showTeamMembers = showTeamMembers;

function downloadCsv(filename, rows) {
    const bom = String.fromCharCode(0xFEFF); const csv = bom + rows.map(r=>r.map(c=>'"'+(String(c||'').replace(/"/g,'""'))+'"').join(',')).join(String.fromCharCode(10));
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
document.getElementById('download-users-btn').addEventListener('click',()=>{
    const header=[getT('colName'),getT('colEmail'),getT('colRole'),getT('colNulab'),getT('colLastLogin'),getT('colJoinedProjs'),'Projects'];
    const rows=[header,...state.users.map(u=>{
        const projList = (u.joinedProjects||[]).map(p=>p.projectKey).join(' / ');
        return [u.name,u.mailAddress,u.roleName,u.nulabAccountName||getT('no'),u.lastLoginTimeJST,u.joinedProjectCount||0,projList];
    })];
    downloadCsv('users.csv',rows);
});
document.getElementById('download-projects-btn').addEventListener('click',()=>{
    const header=[getT('colProjKey'),getT('colProjName'),getT('colArchived'),getT('colUsers'),getT('colTeams'),'Members'];
    const rows=[header,...state.projects.map(p=>{
        let memberList = '--';
        if(p._loaded && p.users){
            const adminIds = p.adminUserIds||[];
            const spaceAdminRole = 'Administrator';
            memberList = p.users.map(u=>{
                const tags = [];
                if(u.roleName===spaceAdminRole) tags.push(String.fromCharCode(9733)+'Admin');
                if(adminIds.includes(u.id)) tags.push(String.fromCharCode(9670)+'PJAdmin');
                return u.name+(tags.length?' ('+tags.join(',')+')':'');
            }).join(' / ');
        }
        return [p.projectKey,p.name,p.archived?getT('archived'):getT('active'),p._loaded?(p.users||[]).length:'--',p._loaded?p.teamCount:'--',memberList];
    })];
    downloadCsv('projects.csv',rows);
});
document.getElementById('extract-new-btn').addEventListener('click',()=>{switchScreen('dashboard');});

async function fetchProjectDetail(index) {
    const proj = state.projects[index];
    if(proj._loaded||proj._loading) return;
    proj._loading = true;
    try {
        const res = await fetch('/api/project/detail',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({spaceId:state.credentials.spaceId,domain:state.credentials.domain,apiKey:state.credentials.apiKey,projectId:proj.id})});
        const detail = await res.json();
        if(!res.ok) throw new Error(detail.error||'Failed');
        proj.users = detail.users||[];
        proj.teams = detail.teams||[];
        proj.teamCount = detail.teamCount||0;
        proj.adminUserIds = detail.adminUserIds||[];
        proj.teamError = detail.teamError||null;
        proj._loaded = true;
        proj._error = null;
        detail.users.forEach(pu=>{
            const u = state.users.find(x=>x.id===pu.id);
            if(u){u.joinedProjectCount++;u.joinedProjects.push({id:proj.id,name:proj.name,projectKey:proj.projectKey});}
        });
    } catch(e){proj._error=e.message;}
    proj._loading = false;
    renderProjects(); renderUsers();
}

document.getElementById('extractForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const spaceId = document.getElementById('space-id').value.trim();
    const domain = document.getElementById('domain').value;
    const apiKey = document.getElementById('api-key').value.trim();
    if(!spaceId||!apiKey) return;
    state.credentials = {spaceId,domain,apiKey};
    switchScreen('processing');
    document.getElementById('activity-log').innerHTML = '';
    document.getElementById('start-time').textContent = new Date().toLocaleTimeString('ja-JP');
    addActivityLog(getT('logFetching'),'active');
    try {
        const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.credentials)});
        const data = await res.json();
        if(!res.ok) throw new Error(data.error||'Unknown error');
        state.teamAvailable = data.teamAvailable !== false;
        state.users = data.users.map(u=>Object.assign({},u,{joinedProjectCount:0,joinedProjects:[]}));
        state.projects = data.projects.map(p=>Object.assign({},p,{users:[],teams:[],teamCount:null,adminUserIds:[],_loaded:false,_loading:false,_error:null}));
        if(data.rateLimit) updateRateLimit(data.rateLimit);
        addActivityLog(getT('logUsersDone')+' ('+state.users.length+')','done');
        addActivityLog(getT('logPermCheck'),'done');
        document.getElementById('stat-users').textContent = state.users.length;
        document.getElementById('stat-projects').textContent = state.projects.length;
        renderUsers(); renderProjects();
        updateProgress(0,state.projects.length);
        switchScreen('results');
        for(let i=0;i<state.projects.length;i++){
            await fetchProjectDetail(i);
            updateProgress(i+1,state.projects.length);
        }
    } catch(err){
        const errEl = document.getElementById('error-message');
        errEl.textContent = err.message; errEl.style.display = 'block';
        switchScreen('dashboard');
    }
});
</script>
</body></html>
`;

app.get('/', (c) => {
  return c.html(uiTemplate);
});

async function fetchAPI(url: string, retries = 3): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const res = await fetch(url);
        if (res.status === 429) {
            if (attempt < retries) {
                const retryAfter = res.headers.get('Retry-After');
                const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, attempt);
                console.log(`Rate limited (429), retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})`);
                await new Promise(r => setTimeout(r, waitMs));
                continue;
            }
            throw new Error(`Rate Limit Exceeded after ${retries} retries`);
        }
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`API Error ${res.status}: ${body}`);
        }
        return res.json() as Promise<any>;
    }
}

app.post('/api/analyze', async (c) => {
    try {
        const { spaceId, domain, apiKey } = await c.req.json();
        if (!spaceId || !domain || !apiKey) {
            return c.json({ error: 'Missing credentials' }, 400);
        }
        
        const base = `https://${spaceId}.${domain}`;
        
        // Space info for role mapping
        const space = await fetchAPI(`${base}/api/v2/space?apiKey=${apiKey}`);
        const roleMap: Record<number, string> = space.licenseType === 1 
            ? { 1: 'Administrator', 2: 'User', 3: 'Guest' }
            : { 1: 'Administrator', 2: 'User', 3: 'Reporter', 4: 'Guest' };
            
        const fmt = (dString: string) => {
            if (!dString) return '';
            try { 
                return new Intl.DateTimeFormat('ja-JP', {
                    timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit',
                    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
                }).format(new Date(dString)).replace(/-/g, '/');
            } catch { return dString; }
        };

        const enhanceUser = (u: any) => ({
            id: u.id,
            name: u.name,
            roleName: roleMap[u.roleType as number] || '',
            mailAddress: u.mailAddress || '',
            nulabAccountName: u.nulabAccount?.name || '',
            lastLoginTimeJST: fmt(u.lastLoginTime),
        });

        // Fetch licence, users, projects in parallel (5 subrequests)
        const [licence, rateLimitRes, rawUsers, rawProjects] = await Promise.all([
            fetchAPI(`${base}/api/v2/space/licence?apiKey=${apiKey}`).catch(() => null),
            fetchAPI(`${base}/api/v2/rateLimit?apiKey=${apiKey}`).catch(() => null),
            fetchAPI(`${base}/api/v2/users?apiKey=${apiKey}`) as Promise<any[]>,
            fetchAPI(`${base}/api/v2/projects?apiKey=${apiKey}&all=true`) as Promise<any[]>,
        ]);

        // Probe team feature availability on first project (1 subrequest)
        let teamAvailable = true;
        if (rawProjects.length > 0) {
            try {
                const probeRes = await fetch(`${base}/api/v2/projects/${rawProjects[0].id}/teams?apiKey=${apiKey}`);
                if (!probeRes.ok) teamAvailable = false;
            } catch {
                teamAvailable = false;
            }
        }

        const users = rawUsers.map((u: any) => enhanceUser(u));
        const projects = rawProjects.map((p: any) => ({
            id: p.id,
            projectKey: p.projectKey,
            name: p.name,
            archived: p.archived,
        }));

        return c.json({
            users,
            projects,
            rateLimit: rateLimitRes ? rateLimitRes.rateLimit : null,
            teamAvailable,
            licence: licence || null
        });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// Per-project detail endpoint (users, teams, admins) — keeps subrequests low per call
app.post('/api/project/detail', async (c) => {
    try {
        const { spaceId, domain, apiKey, projectId } = await c.req.json();
        if (!spaceId || !domain || !apiKey || !projectId) {
            return c.json({ error: 'Missing parameters' }, 400);
        }

        const base = `https://${spaceId}.${domain}`;

        const space = await fetchAPI(`${base}/api/v2/space?apiKey=${apiKey}`);
        const roleMap: Record<number, string> = space.licenseType === 1
            ? { 1: 'Administrator', 2: 'User', 3: 'Guest' }
            : { 1: 'Administrator', 2: 'User', 3: 'Reporter', 4: 'Guest' };

        const fmt = (dString: string) => {
            if (!dString) return '';
            try {
                return new Intl.DateTimeFormat('ja-JP', {
                    timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit',
                    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
                }).format(new Date(dString)).replace(/-/g, '/');
            } catch { return dString; }
        };

        const enhanceUser = (u: any) => ({
            id: u.id,
            name: u.name,
            roleName: roleMap[u.roleType as number] || '',
            mailAddress: u.mailAddress || '',
            nulabAccountName: u.nulabAccount?.name || '',
            lastLoginTimeJST: fmt(u.lastLoginTime),
        });

        // Fetch users, teams, admins in parallel (4 subrequests including space above)
        let teamError: string | null = null;
        const [pUsers, pTeams, pAdmins] = await Promise.all([
            fetchAPI(`${base}/api/v2/projects/${projectId}/users?apiKey=${apiKey}&excludeGroupMembers=true`).catch(() => []),
            fetchAPI(`${base}/api/v2/projects/${projectId}/teams?apiKey=${apiKey}`).catch((e: any) => {
                teamError = e.message || 'Unknown error';
                return [];
            }),
            fetchAPI(`${base}/api/v2/projects/${projectId}/administrators?apiKey=${apiKey}`).catch(() => []),
        ]);

        const users = (Array.isArray(pUsers) ? pUsers : []).map((u: any) => enhanceUser(u));
        const teams = (Array.isArray(pTeams) ? pTeams : []).map((t: any) => ({
            id: t.id,
            name: t.name,
            updated: t.updated,
            memberCount: (t.members || []).length,
        }));
        const adminUserIds = (Array.isArray(pAdmins) ? pAdmins : []).map((a: any) => a.id);

        return c.json({ users, teams, teamCount: teams.length, adminUserIds, teamError });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// On-demand team members endpoint
app.post('/api/team/members', async (c) => {
    try {
        const { spaceId, domain, apiKey, projectId, teamId } = await c.req.json();
        if (!spaceId || !domain || !apiKey || !projectId || !teamId) {
            return c.json({ error: 'Missing parameters' }, 400);
        }

        const base = `https://${spaceId}.${domain}`;

        const space = await fetchAPI(`${base}/api/v2/space?apiKey=${apiKey}`);
        const roleMap: Record<number, string> = space.licenseType === 1
            ? { 1: 'Administrator', 2: 'User', 3: 'Guest' }
            : { 1: 'Administrator', 2: 'User', 3: 'Reporter', 4: 'Guest' };

        const fmt = (dString: string) => {
            if (!dString) return '';
            try {
                return new Intl.DateTimeFormat('ja-JP', {
                    timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit',
                    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
                }).format(new Date(dString)).replace(/-/g, '/');
            } catch { return dString; }
        };

        // Fetch teams for the project and find the specific team
        const pTeams = await fetchAPI(`${base}/api/v2/projects/${projectId}/teams?apiKey=${apiKey}`);
        const team = (pTeams as any[]).find((t: any) => t.id === teamId);
        if (!team) {
            return c.json({ error: 'Team not found' }, 404);
        }

        const members = (team.members || []).map((m: any) => ({
            id: m.id,
            name: m.name,
            roleName: roleMap[m.roleType as number] || '',
            mailAddress: m.mailAddress || '',
            nulabAccountName: m.nulabAccount?.name || '',
            lastLoginTimeJST: fmt(m.lastLoginTime),
        }));

        return c.json({ teamName: team.name, members });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default app;
