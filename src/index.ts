import { Hono } from 'hono';

const app = new Hono();

const uiTemplate = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backlog ユーザー・プロジェクト抽出 (Web版)</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
        }
        body.dark-mode {
            background-color: #222;
            color: #eee;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        body.dark-mode .container {
            background-color: #333;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        h1 {
            margin-top: 0;
            color: #2c3e50;
        }
        body.dark-mode h1 {
            color: #e0e0e0;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        body.dark-mode input[type="text"], body.dark-mode input[type="password"] {
            background-color: #444;
            border-color: #555;
            color: #eee;
        }
        select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fff;
            margin-top: 5px;
            width: 100%;
        }
        body.dark-mode select {
            background-color: #444;
            border-color: #555;
            color: #eee;
        }
        .space-domain-group {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }
        .space-id-container {
            flex: 1;
        }
        .domain-container {
            width: 180px;
        }
        button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #2980b9;
        }
        button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }
        body.dark-mode button {
            background-color: #2980b9;
        }
        body.dark-mode button:hover {
            background-color: #3498db;
        }
        body.dark-mode button:disabled {
            background-color: #7f8c8d;
        }
        .toggle-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-bottom: 20px;
        }
        .toggle-button {
            background-color: #95a5a6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .toggle-button:hover {
            background-color: #7f8c8d;
        }
        .results {
            margin-top: 30px;
            display: none;
        }
        .loading {
            text-align: center;
            padding: 20px;
            display: none;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        body.dark-mode th, body.dark-mode td {
            border-bottom: 1px solid #444;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        body.dark-mode th {
            background-color: #444;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        body.dark-mode tr:nth-child(even) {
            background-color: #3a3a3a;
        }
        body.dark-mode tr:nth-child(odd) {
            background-color: #333;
        }
        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .error-message {
            color: #e74c3c;
            margin-top: 10px;
            display: none;
            padding: 10px;
            background-color: #fadbd8;
            border-radius: 4px;
        }
        body.dark-mode .error-message {
            color: #ff6b6b;
            background-color: #641e16;
        }
        /* Tab Styles */
        .tabs {
            display: flex;
            border-bottom: 2px solid #ddd;
            margin-bottom: 20px;
            margin-top: 20px;
        }
        body.dark-mode .tabs {
            border-bottom: 2px solid #555;
        }
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
            color: #7f8c8d;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
        }
        body.dark-mode .tab {
            color: #aaa;
        }
        .tab:hover {
            color: #34495e;
        }
        body.dark-mode .tab:hover {
            color: #eee;
        }
        .tab.active {
            color: #3498db;
            border-bottom: 3px solid #3498db;
        }
        body.dark-mode .tab.active {
            color: #5dade2;
            border-bottom: 3px solid #5dade2;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
            background-color: #fff;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 900px;
            max-height: 80vh;
            overflow-y: auto;
        }
        body.dark-mode .modal-content {
            background-color: #333;
            color: #eee;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: #555;
        }
        body.dark-mode .close {
            color: #ccc;
        }
        body.dark-mode .close:hover {
            color: #fff;
        }
        /* Rate Limit Styles */
        .rate-limit-bar {
            margin-top: 15px;
            background-color: #ecf0f1;
            border-radius: 4px;
            height: 20px;
            width: 100%;
            overflow: hidden;
            position: relative;
            display: none;
        }
        body.dark-mode .rate-limit-bar {
            background-color: #555;
        }
        .rate-limit-progress {
            background-color: #2ecc71;
            height: 100%;
            width: 100%;
            transition: width 0.3s;
        }
        .rate-limit-progress.warning {
            background-color: #f1c40f;
        }
        .rate-limit-progress.danger {
            background-color: #e74c3c;
        }
        .rate-limit-text {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
            line-height: 20px;
            color: #333;
            font-weight: bold;
        }
        body.dark-mode .rate-limit-text {
            color: #fff;
            text-shadow: 1px 1px 2px #000;
        }
        .clickable {
            color: #3498db;
            cursor: pointer;
            text-decoration: underline;
        }
        .clickable:hover {
            color: #2980b9;
        }
        body.dark-mode .clickable {
            color: #5dade2;
        }
        body.dark-mode .clickable:hover {
            color: #3498db;
        }
    </style>
</head>
<body>
    <div class="toggle-buttons" style="display:flex; justify-content:flex-end; align-items:center; gap:10px;">
        <select id="lang-toggle" style="width: auto; margin-top: 0; padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; background-color: white; cursor: pointer;">
            <option value="ja">日本語</option>
            <option value="en">English</option>
        </select>
        <button id="dark-mode-toggle" class="toggle-button" data-i18n="darkMode">ダークモード切替</button>
    </div>

    <div class="container">
        <h1 id="title" data-i18n="title">Backlog ユーザー・プロジェクト抽出</h1>
        <p id="description" data-i18n="desc">スペースのユーザーおよびプロジェクトの参加状況を抽出します。</p>

        <form id="extractForm">
            <div class="form-group">
                <div class="space-domain-group">
                    <div class="space-id-container">
                        <label for="space-id" data-i18n="spaceId">スペースID:</label>
                        <input type="text" id="space-id" required placeholder="例: mycompany" data-i18n-placeholder="spaceIdPlaceholder">
                    </div>
                    <div class="domain-container">
                        <label for="domain" data-i18n="domain">ドメイン:</label>
                        <select id="domain">
                            <option value="backlog.jp">backlog.jp</option>
                            <option value="backlog.com">backlog.com</option>
                            <option value="backlogtool.com">backlogtool.com</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="api-key" data-i18n="apiKey">APIキー:</label>
                <input type="password" id="api-key" required placeholder="Backlog APIキーを入力" data-i18n-placeholder="apiKeyPlaceholder">
            </div>

            <button type="submit" id="search-button" data-i18n="execBtn">抽出実行</button>
            <div id="rate-limit-container" class="rate-limit-bar">
                <div id="rate-limit-progress" class="rate-limit-progress"></div>
                <div class="rate-limit-text"><span data-i18n="apiLimit">API制限:</span> <span id="rate-limit-value">--/--</span> (<span data-i18n="reset">リセット:</span> <span id="rate-limit-reset">--:--</span>)</div>
            </div>
            <div id="error-message" class="error-message"></div>
        </form>

        <div id="loading" class="loading">
            <p data-i18n="loading">データを取得・集計中...（プロジェクト数が多い場合、数十秒かかることがあります）</p>
        </div>

        <div id="results" class="results">
            <div class="tabs">
                <div class="tab active" data-tab="tab-users" data-i18n="tabUsers">ユーザー一覧</div>
                <div class="tab" data-tab="tab-projects" data-i18n="tabProjects">プロジェクト一覧</div>
            </div>

            <div id="tab-users" class="tab-content active">
                <div class="action-buttons mb-4" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="userEmailSearch" placeholder="メールアドレスで検索..." data-i18n-placeholder="searchEmail" style="padding:5px; border-radius:4px; border:1px solid #ddd; width:220px;" class="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <select id="userPerPage" style="width: auto; margin-top: 0; padding:5px; border-radius:4px; border:1px solid #ddd;" class="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option value="20" data-i18n="show20">20件表示</option>
                            <option value="50" data-i18n="show50">50件表示</option>
                            <option value="100" data-i18n="show100">100件表示</option>
                        </select>
                    </div>
                    <button id="download-users-btn" data-i18n="downloadCsv">CSVダウンロード</button>
                </div>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr class="sortable-headers" data-type="user">
                                <th data-sort="name" style="cursor:pointer; user-select:none;"><span data-i18n="colName">名前</span> <span class="sort-icon"></span></th>
                                <th data-sort="mailAddress" style="cursor:pointer; user-select:none;"><span data-i18n="colEmail">メールアドレス</span> <span class="sort-icon"></span></th>
                                <th data-sort="hasNulab" style="cursor:pointer; user-select:none;"><span data-i18n="colNulab">Nulabアカウント</span> <span class="sort-icon"></span></th>
                                <th data-sort="roleType" style="cursor:pointer; user-select:none;"><span data-i18n="colRole">権限</span> <span class="sort-icon"></span></th>
                                <th data-sort="lastLoginTime" style="cursor:pointer; user-select:none;"><span data-i18n="colLastLogin">最終ログイン</span> <span class="sort-icon"></span></th>
                                <th data-sort="projectCount" style="cursor:pointer; user-select:none;"><span data-i18n="colJoinedProjs">参加プロジェクト数</span> <span class="sort-icon"></span></th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody"></tbody>
                    </table>
                </div>
                <div id="userPagination" style="display:flex; justify-content:center; margin-top:15px; gap:5px; flex-wrap:wrap;"></div>
            </div>

            <div id="tab-projects" class="tab-content">
                <div class="action-buttons mb-4" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="projectKeySearch" placeholder="プロジェクトキーで検索..." data-i18n-placeholder="searchProject" style="padding:5px; border-radius:4px; border:1px solid #ddd; width:220px;" class="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <select id="projectPerPage" style="width: auto; margin-top: 0; padding:5px; border-radius:4px; border:1px solid #ddd;" class="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option value="20" data-i18n="show20">20件表示</option>
                            <option value="50" data-i18n="show50">50件表示</option>
                            <option value="100" data-i18n="show100">100件表示</option>
                        </select>
                    </div>
                    <button id="download-projects-btn" data-i18n="downloadCsv">CSVダウンロード</button>
                </div>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr class="sortable-headers" data-type="project">
                                <th data-sort="projectKey" style="cursor:pointer; user-select:none;"><span data-i18n="colProjKey">プロジェクトキー</span> <span class="sort-icon"></span></th>
                                <th data-sort="name" style="cursor:pointer; user-select:none;"><span data-i18n="colProjName">プロジェクト名</span> <span class="sort-icon"></span></th>
                                <th data-sort="archived" style="cursor:pointer; user-select:none;"><span data-i18n="colArchived">アーカイブ状態</span> <span class="sort-icon"></span></th>
                                <th data-sort="userCount" style="cursor:pointer; user-select:none;"><span data-i18n="colUsers">ユーザ参加数</span> <span class="sort-icon"></span></th>
                                <th data-sort="teamCount" style="cursor:pointer; user-select:none;"><span data-i18n="colTeams">チーム参加数</span> <span class="sort-icon"></span></th>
                            </tr>
                        </thead>
                        <tbody id="projects-tbody"></tbody>
                    </table>
                </div>
                <div id="projectPagination" style="display:flex; justify-content:center; margin-top:15px; gap:5px; flex-wrap:wrap;"></div>
            </div>
        </div>
    </div>

    <!-- モーダル -->
    <div id="detail-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="modal-title" style="margin-top: 0;" data-i18n="modalDetails">詳細</h2>
            <div id="modal-body" style="margin-top: 20px;"></div>
        </div>
    </div>

    <script>
        // State
        const state = {
            darkMode: localStorage.getItem('darkMode') === 'true',
            users: [],
            projects: [],
            teamAvailable: true,
            rateLimit: null,
            filters: { userEmail: '', projectKey: '' },
            pagination: { 
                user: { page: 1, perPage: 20 },
                project: { page: 1, perPage: 20 }
            },
            sort: {
                user: { key: 'name', asc: true },
                project: { key: 'projectKey', asc: true }
            }
        };

        
        const t = {
            ja: {
                darkMode: "ダークモード切替",
                title: "Backlog ユーザー・プロジェクト抽出",
                desc: "スペースのユーザーおよびプロジェクトの参加状況を抽出します。",
                spaceId: "スペースID:",
                spaceIdPlaceholder: "例: mycompany",
                domain: "ドメイン:",
                apiKey: "APIキー:",
                apiKeyPlaceholder: "Backlog APIキーを入力",
                execBtn: "抽出実行",
                apiLimit: "API制限:",
                reset: "リセット:",
                loading: "データを取得・集計中...（プロジェクト数が多い場合、数十秒かかることがあります）",
                tabUsers: "ユーザー一覧",
                tabProjects: "プロジェクト一覧",
                searchEmail: "メールアドレスで検索...",
                searchProject: "プロジェクトキーで検索...",
                show20: "20件表示",
                show50: "50件表示",
                show100: "100件表示",
                downloadCsv: "CSVダウンロード",
                colName: "名前",
                colEmail: "メールアドレス",
                colNulab: "Nulabアカウント",
                colRole: "権限",
                colLastLogin: "最終ログイン",
                colJoinedProjs: "参加プロジェクト数",
                colProjKey: "プロジェクトキー",
                colProjName: "プロジェクト名",
                colArchived: "アーカイブ状態",
                colUsers: "ユーザ参加数",
                colTeams: "チーム参加数",
                modalDetails: "詳細",
                closeBtn: "閉じる",
                yes: "あり",
                no: "なし",
                none: "なし",
                yesStr: "はい",
                noStr: "いいえ",
                prev: "前へ",
                next: "次へ",
                userProjsTitle: "が参加しているプロジェクト ({count}件)",
                projUsersTitle: "に参加しているユーザー ({count}名)",
                projTeamsTitle: "に参加しているチーム ({count}件)",
                teamUsersTitle: "のメンバー ({count}名)",
                teamName: "チーム名",
                members: "人数",
                updated: "更新日"
            },
            en: {
                darkMode: "Toggle Dark Mode",
                title: "Backlog User & Project Extractor",
                desc: "Extracts user and project participation status in the space.",
                spaceId: "Space ID:",
                spaceIdPlaceholder: "e.g. mycompany",
                domain: "Domain:",
                apiKey: "API Key:",
                apiKeyPlaceholder: "Enter Backlog API Key",
                execBtn: "Execute",
                apiLimit: "API Limit:",
                reset: "Reset:",
                loading: "Fetching and aggregating data... (May take a moment)",
                tabUsers: "Users",
                tabProjects: "Projects",
                searchEmail: "Search by email...",
                searchProject: "Search by project key...",
                show20: "Show 20",
                show50: "Show 50",
                show100: "Show 100",
                downloadCsv: "Download CSV",
                colName: "Name",
                colEmail: "Email",
                colNulab: "Nulab Account",
                colRole: "Role",
                colLastLogin: "Last Login",
                colJoinedProjs: "Joined Projects",
                colProjKey: "Project Key",
                colProjName: "Project Name",
                colArchived: "Archived",
                colUsers: "Users",
                colTeams: "Teams",
                modalDetails: "Details",
                closeBtn: "Close",
                yes: "Yes",
                no: "No",
                none: "None",
                yesStr: "Yes",
                noStr: "No",
                prev: "Prev",
                next: "Next",
                userProjsTitle: "'s Joined Projects ({count})",
                projUsersTitle: "'s Users ({count})",
                projTeamsTitle: "'s Teams ({count})",
                teamUsersTitle: "'s Members ({count})",
                teamName: "Team Name",
                members: "Members",
                updated: "Updated"
            }
        };

        const currentLang = localStorage.getItem('lang') || 'ja';
        const getT = (key, params={}) => {
            let str = t[currentLang][key] || key;
            for(const [k, v] of Object.entries(params)) {
                str = str.replace('{'+k+'}', v);
            }
            return str;
        };
        
        function updateI18n() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if(t[currentLang][key]) el.textContent = t[currentLang][key];
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if(t[currentLang][key]) el.placeholder = t[currentLang][key];
            });
        }
\n\n        // Dark Mode Logic
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (state.darkMode) document.body.classList.add('dark-mode');
        
        toggleBtn.addEventListener('click', () => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
            if (state.darkMode) document.body.classList.add('dark-mode');
            else document.body.classList.remove('dark-mode');
        });

        
        const langToggle = document.getElementById('lang-toggle');
        langToggle.value = currentLang;
        langToggle.addEventListener('change', (e) => {
            localStorage.setItem('lang', e.target.value);
            location.reload();
        });
        updateI18n();
\n\n        // Tabs Logic
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Modal Logic
        const modal = document.getElementById('detail-modal');
        const modalClose = document.querySelector('.close');
        modalClose.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

        function openModal(title, htmlContent) {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-body').innerHTML = htmlContent;
            modal.style.display = "block";
        }

        function formatJST(dateStr) {
            if (!dateStr) return '';
            try { return new Date(dateStr).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/-/g, '/'); } 
            catch { return dateStr; }
        }

        function updateRateLimit(rateLimitObj) {
            if (!rateLimitObj || !rateLimitObj.read) return;
            const read = rateLimitObj.read;
            const container = document.getElementById('rate-limit-container');
            const progress = document.getElementById('rate-limit-progress');
            const valueTxt = document.getElementById('rate-limit-value');
            const resetTxt = document.getElementById('rate-limit-reset');
            
            container.style.display = 'block';
            let remain = read.remaining;
            let limit = read.limit;
            let reset = new Date(read.reset * 1000).toLocaleTimeString('ja-JP');
            
            valueTxt.textContent = \`\${remain} / \${limit}\`;
            resetTxt.textContent = reset;
            
            let pct = (remain / limit) * 100;
            progress.style.width = \`\${pct}%\`;
            
            progress.className = 'rate-limit-progress';
            if (pct < 20) progress.classList.add('danger');
            else if (pct < 50) progress.classList.add('warning');
        }

        // Action Logic
        document.getElementById('extractForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const spaceId = document.getElementById('space-id').value;
            const domain = document.getElementById('domain').value;
            const apiKey = document.getElementById('api-key').value;
            
            document.getElementById('search-button').disabled = true;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            document.getElementById('error-message').style.display = 'none';
            
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spaceId, domain, apiKey })
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || '予期せぬエラー');
                
                state.users = data.users;
                state.projects = data.projects;
                state.teamAvailable = data.teamAvailable !== false;
                if (data.rateLimit) updateRateLimit(data.rateLimit);

                renderUsers();
                renderProjects();
                
                document.getElementById('results').style.display = 'block';
            } catch (err) {
                const el = document.getElementById('error-message');
                el.textContent = err.message;
                el.style.display = 'block';
            } finally {
                document.getElementById('search-button').disabled = false;
                document.getElementById('loading').style.display = 'none';
            }
        });

        function renderUsers() {
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = '';
            
            let filtered = state.users.filter(u => !state.filters.userEmail || (u.mailAddress && u.mailAddress.toLowerCase().includes(state.filters.userEmail)));
            filtered = sortData(filtered, state.sort.user.key, state.sort.user.asc);
            
            const { page, perPage } = state.pagination.user;
            const totalPages = Math.ceil(filtered.length / perPage) || 1;
            if (state.pagination.user.page > totalPages) state.pagination.user.page = totalPages;
            
            const start = (state.pagination.user.page - 1) * perPage;
            const paginated = filtered.slice(start, start + perPage);
            
            paginated.forEach(u => {
                const tr = document.createElement('tr');
                const nulabStr = u.nulabAccountName ? getT('yes') + ' (' + u.nulabAccountName + ')' : getT('no');
                tr.innerHTML = \`
                    <td>\${u.name}</td>
                    <td>\${u.mailAddress || ''}</td>
                    <td>\${nulabStr}</td>
                    <td>\${u.roleName || ''}</td>
                    <td>\${u.lastLoginTimeJST || ''}</td>
                    <td>
                        <span class="clickable user-projects-link" data-uid="\${u.id}">\${u.joinedProjectCount}</span>
                    </td>
                \`;
                tbody.appendChild(tr);
            });

            buildPagination('user', totalPages, state.pagination.user.page);

            document.querySelectorAll('.user-projects-link').forEach(el => {
                el.addEventListener('click', (e) => {
                    const uid = parseInt(e.target.dataset.uid);
                    const user = state.users.find(x => x.id === uid);
                    showUserProjectsModal(user);
                });
            });
        }

        function showUserProjectsModal(user) {
            let html = \`
                <p><strong>\${user.name}</strong> \${getT('userProjsTitle', {count: user.joinedProjects.length})}</p>
                <table>
                    <thead><tr><th>\${getT('colProjKey')}</th><th>\${getT('colProjName')}</th></tr></thead>
                    <tbody>
            \`;
            user.joinedProjects.forEach(p => {
                html += \`<tr><td>\${p.projectKey}</td><td>\${p.name}</td></tr>\`;
            });
            html += \`</tbody></table>\`;
            openModal('ユーザー参加プロジェクト', html);
        }

        // Render Projects Tab
        function renderProjects() {
            const tbody = document.getElementById('projects-tbody');
            tbody.innerHTML = '';
            
            let filtered = state.projects.filter(p => !state.filters.projectKey || (p.projectKey && p.projectKey.toLowerCase().includes(state.filters.projectKey)));
            filtered = sortData(filtered, state.sort.project.key, state.sort.project.asc);
            
            const { page, perPage } = state.pagination.project;
            const totalPages = Math.ceil(filtered.length / perPage) || 1;
            if (state.pagination.project.page > totalPages) state.pagination.project.page = totalPages;
            
            const start = (state.pagination.project.page - 1) * perPage;
            const paginated = filtered.slice(start, start + perPage);

            paginated.forEach(p => {
                const tr = document.createElement('tr');
                let teamDisplay;
                if (!state.teamAvailable) {
                    teamDisplay = '<span style="color:#95a5a6;" title="' + (currentLang === 'ja' ? 'ご利用のプランではチーム機能は利用できません' : 'Team feature is not available on your plan') + '">N/A</span>';
                } else if (p.teamError) {
                    teamDisplay = '<span style="color:#e74c3c;" title="' + p.teamError + '">⚠ Error</span>';
                } else {
                    teamDisplay = '<span class="clickable proj-teams-link" data-pid="' + p.id + '">' + p.teams.length + '</span>';
                }
                tr.innerHTML = \`
                    <td>\${p.projectKey}</td>
                    <td>\${p.name}</td>
                    <td>\${p.archived ? getT('yesStr') : getT('noStr')}</td>
                    <td>
                        <span class="clickable proj-users-link" data-pid="\${p.id}">\${p.users.length}</span>
                    </td>
                    <td>
                        \${teamDisplay}
                    </td>
                \`;
                tbody.appendChild(tr);
            });

            buildPagination('project', totalPages, state.pagination.project.page);

            document.querySelectorAll('.proj-users-link').forEach(el => {
                el.addEventListener('click', (e) => {
                    const pid = parseInt(e.target.dataset.pid);
                    const proj = state.projects.find(x => x.id === pid);
                    showProjectUsersModal(proj);
                });
            });

            document.querySelectorAll('.proj-teams-link').forEach(el => {
                el.addEventListener('click', (e) => {
                    const pid = parseInt(e.target.dataset.pid);
                    const proj = state.projects.find(x => x.id === pid);
                    showProjectTeamsModal(proj);
                });
            });
        }

        function showProjectUsersModal(proj) {
            let html = \`
                <p><strong>\${proj.name}</strong> \${getT('projUsersTitle', {count: proj.users.length})}</p>
                <table>
                    <thead><tr><th>\${getT('colName')}</th><th>\${getT('colEmail')}</th><th>\${getT('colRole')}</th><th>\${getT('colNulab')}</th><th>\${getT('colLastLogin')}</th></tr></thead>
                    <tbody>
            \`;
            proj.users.forEach(u => {
                html += \`<tr>
                    <td><span class="clickable user-projects-nested-link" data-uid="\${u.id}">\${u.name}</span></td>
                    <td>\${u.mailAddress || ''}</td>
                    <td>\${u.roleName || ''}</td>
                    <td>\${u.nulabAccountName ? getT('yes') : getT('no')}</td>
                    <td>\${u.lastLoginTimeJST || ''}</td>
                </tr>\`;
            });
            html += \`</tbody></table>\`;
            openModal('プロジェクト参加ユーザー', html);

            // Nested links
            document.querySelectorAll('.user-projects-nested-link').forEach(el => {
                el.addEventListener('click', (e) => {
                    const uid = parseInt(e.target.dataset.uid);
                    const user = state.users.find(x => x.id === uid);
                    showUserProjectsModal(user); // replaces modal content
                });
            });
        }

        function showProjectTeamsModal(proj) {
            let html = \`
                <p><strong>\${proj.name}</strong> \${getT('projTeamsTitle', {count: proj.teams.length})}</p>
                <table>
                    <thead><tr><th>\${getT('teamName')}</th><th>\${getT('members')}</th><th>\${getT('updated')}</th></tr></thead>
                    <tbody>
            \`;
            proj.teams.forEach(t => {
                html += \`<tr>
                    <td>\${t.name}</td>
                    <td><span class="clickable team-users-nested-link" data-tid="\${t.id}">\${t.members.length}</span></td>
                    <td>\${formatJST(t.updated)}</td>
                </tr>\`;
            });
            html += \`</tbody></table>\`;
            openModal('プロジェクト参加チーム', html);

            document.querySelectorAll('.team-users-nested-link').forEach(el => {
                el.addEventListener('click', (e) => {
                    const tid = parseInt(e.target.dataset.tid);
                    // Find team from the current project
                    const team = proj.teams.find(x => x.id === tid);
                    showTeamUsersModal(team);
                });
            });
        }

        function showTeamUsersModal(team) {
            let html = \`
                <p><strong>\${team.name}</strong> \${getT('teamUsersTitle', {count: team.members.length})}</p>
                <table>
                    <thead><tr><th>名前</th><th>メールアドレス</th><th>権限</th><th>ヌーラボアカウント</th><th>最終ログイン</th></tr></thead>
                    <tbody>
            \`;
            team.members.forEach(u => {
                html += \`<tr>
                    <td>\${u.name}</td>
                    <td>\${u.mailAddress || ''}</td>
                    <td>\${u.roleName || ''}</td>
                    <td>\${u.nulabAccountName ? 'あり' : 'なし'}</td>
                    <td>\${u.lastLoginTimeJST || ''}</td>
                </tr>\`;
            });
            html += \`</tbody></table>
            <button onclick="document.querySelector('.close').click()" style="margin-top: 15px; background-color: #95a5a6;" data-i18n="closeBtn">閉じる</button>
            \`;
            openModal('チームメンバー詳細', html);
        }

        // Pagination, Search, Sorting Logic
        const els = {
            ueSearch: document.getElementById('userEmailSearch'),
            uPer: document.getElementById('userPerPage'),
            uPag: document.getElementById('userPagination'),
            pkSearch: document.getElementById('projectKeySearch'),
            pPer: document.getElementById('projectPerPage'),
            pPag: document.getElementById('projectPagination')
        };

        if(els.ueSearch) els.ueSearch.addEventListener('input', (e) => { state.filters.userEmail = e.target.value.toLowerCase(); state.pagination.user.page = 1; renderUsers(); });
        if(els.uPer) els.uPer.addEventListener('change', (e) => { state.pagination.user.perPage = parseInt(e.target.value); state.pagination.user.page = 1; renderUsers(); });
        if(els.pkSearch) els.pkSearch.addEventListener('input', (e) => { state.filters.projectKey = e.target.value.toLowerCase(); state.pagination.project.page = 1; renderProjects(); });
        if(els.pPer) els.pPer.addEventListener('change', (e) => { state.pagination.project.perPage = parseInt(e.target.value); state.pagination.project.page = 1; renderProjects(); });

        document.querySelectorAll('.sortable-headers th[data-sort]').forEach(th => {
            th.addEventListener('click', (e) => {
                const type = th.parentElement.dataset.type;
                const key = th.dataset.sort;
                if(state.sort[type].key === key) {
                    state.sort[type].asc = !state.sort[type].asc;
                } else {
                    state.sort[type].key = key;
                    state.sort[type].asc = true;
                }
                
                th.parentElement.querySelectorAll('.sort-icon').forEach(span => span.textContent = '');
                th.querySelector('.sort-icon').textContent = state.sort[type].asc ? ' ▲' : ' ▼';

                if(type === 'user') renderUsers();
                else renderProjects();
            });
        });

        function sortData(arr, key, asc) {
            return arr.slice().sort((a, b) => {
                let vA = a[key] !== undefined && a[key] !== null ? a[key] : '';
                let vB = b[key] !== undefined && b[key] !== null ? b[key] : '';
                
                if(key === 'projectCount') { vA = (a.joinedProjects||[]).length; vB = (b.joinedProjects||[]).length; }
                if(key === 'userCount') { vA = (a.users||[]).length; vB = (b.users||[]).length; }
                if(key === 'teamCount') { vA = (a.teams||[]).length; vB = (b.teams||[]).length; }
                if(key === 'hasNulab') { vA = (a.nulabAccountName ? 1 : 0); vB = (b.nulabAccountName ? 1 : 0); }

                if (typeof vA === 'string') vA = vA.toLowerCase();
                if (typeof vB === 'string') vB = vB.toLowerCase();

                if (vA < vB) return asc ? -1 : 1;
                if (vA > vB) return asc ? 1 : -1;
                return 0;
            });
        }

        function buildPagination(type, totalPages, currentPage) {
            const container = type === 'user' ? els.uPag : els.pPag;
            container.innerHTML = '';
            if(totalPages <= 1) return;

            const createBtn = (label, pageNum, disabled, active) => {
                const btn = document.createElement('button');
                btn.innerHTML = label;
                btn.style.padding = '3px 8px';
                btn.style.border = '1px solid #ddd';
                btn.style.borderRadius = '4px';
                btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
                btn.style.fontSize = '12px';
                
                if(active) { btn.style.backgroundColor = '#3b82f6'; btn.style.color = '#fff'; btn.style.borderColor = '#3b82f6'; }
                else if (disabled) { btn.style.backgroundColor = '#f5f5f5'; btn.style.color = '#999'; }
                else { btn.style.backgroundColor = '#fff'; btn.style.color = '#333'; }
                
                if(!disabled && !active) {
                    btn.addEventListener('click', () => {
                        state.pagination[type].page = pageNum;
                        if(type === 'user') renderUsers();
                        else renderProjects();
                    });
                }
                return btn;
            };

            container.appendChild(createBtn(getT('prev'), currentPage - 1, currentPage === 1, false));
            
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            if (startPage > 1) { container.appendChild(createBtn('1', 1, false, false)); if(startPage > 2) container.appendChild(createBtn('...', 0, true, false)); }
            
            for(let i=startPage; i<=endPage; i++) {
                container.appendChild(createBtn(i, i, false, i === currentPage));
            }

            if (endPage < totalPages) { if(endPage < totalPages - 1) container.appendChild(createBtn('...', 0, true, false)); container.appendChild(createBtn(totalPages, totalPages, false, false)); }

            container.appendChild(createBtn(getT('next'), currentPage + 1, currentPage === totalPages, false));
        }

        // CSV Downloads
        document.getElementById('download-users-btn').addEventListener('click', () => {
             const rows = [[getT('colName'), getT('colEmail'), getT('colNulab'), getT('colRole'), getT('colLastLogin'), getT('colProjKey'), getT('colProjName')]];
             state.users.forEach(u => {
                 if (u.joinedProjects && u.joinedProjects.length > 0) {
                     u.joinedProjects.forEach(p => {
                         rows.push([u.name, u.mailAddress, u.nulabAccountName ? getT('yes')+' ('+u.nulabAccountName+')' : getT('no'), u.roleName, u.lastLoginTimeJST, p.projectKey, p.name]);
                     });
                 } else {
                     rows.push([u.name, u.mailAddress, u.nulabAccountName ? getT('yes')+' ('+u.nulabAccountName+')' : getT('no'), u.roleName, u.lastLoginTimeJST, '', '']);
                 }
             });
             downloadCSV('Users', rows);
        });

        document.getElementById('download-projects-btn').addEventListener('click', () => {
             const header = [getT('colProjKey'), getT('colEmail'), getT('colName'), getT('teamName'), currentLang === 'ja' ? 'プロジェクト管理者' : 'Project Admin'];
             const rows = [header];
             state.projects.forEach(p => {
                 const adminIds = new Set(p.adminUserIds || []);
                 const userRows = (p.users || []).map(u => ({ email: u.mailAddress || '', name: u.name || '', isAdmin: adminIds.has(u.id) }));
                 const teamNames = (p.teams || []).map(t => t.name || '');
                 if (userRows.length === 0 && teamNames.length === 0) {
                     rows.push([p.projectKey, '', '', '', '']);
                 } else {
                     const maxLen = Math.max(userRows.length, teamNames.length);
                     for (let i = 0; i < maxLen; i++) {
                         const u = userRows[i];
                         const tn = teamNames[i] || '';
                         rows.push([p.projectKey, u ? u.email : '', u ? u.name : '', tn, u && u.isAdmin ? '●' : '']);
                     }
                 }
             });
             downloadCSV('Projects', rows);
        });

        function downloadCSV(prefix, rows) {
            const csvContent = rows.map(r => r.map(v => '"' + String(v||'').replace(/"/g, '""') + '"').join(',')).join('\\n');
            const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = \`\${prefix}_\${new Date().toISOString().slice(0,10).replace(/-/g,'')}.csv\`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    </script>
</body>
</html>
`;

app.get('/', (c) => {
  return c.html(uiTemplate);
});

async function fetchAPI(url: string): Promise<any> {
    const res = await fetch(url);
    if (res.status === 429) {
        throw new Error('API Rate Limit Exceeded: Wait and try again.');
    }
    if (!res.ok) {
        throw new Error(`API Error ${res.status} at ${url}`);
    }
    return res.json() as Promise<any>;
}

app.post('/api/analyze', async (c) => {
    try {
        const { spaceId, domain, apiKey } = await c.req.json();
        if (!spaceId || !domain || !apiKey) {
            return c.json({ error: 'Missing credentials' }, 400);
        }
        
        const base = `https://${spaceId}.${domain}`;
        
        // Fetch Rate Limits
        let rateLimitRes = null;
        try {
            rateLimitRes = await fetchAPI(`${base}/api/v2/rateLimit?apiKey=${apiKey}`);
        } catch(e) { console.warn("Could not fetch RateLimit", e); }

        // Space info for role mapping
        const space = await fetchAPI(`${base}/api/v2/space?apiKey=${apiKey}`);
        const roleMap: Record<number, string> = space.licenseType === 1 
            ? { 1: 'Administrator', 2: 'User', 3: 'Guest' }
            : { 1: 'Administrator', 2: 'User', 3: 'Reporter', 4: 'Guest' };
            
        // Setup formatter
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
            joinedProjectCount: 0,
            joinedProjects: [] as any[]
        });

        // 1. Fetch Licence, All Users and Projects
        const [licence, rawUsers, rawProjects] = await Promise.all([
            fetchAPI(`${base}/api/v2/space/licence?apiKey=${apiKey}`).catch(() => null),
            fetchAPI(`${base}/api/v2/users?apiKey=${apiKey}`) as Promise<any[]>,
            fetchAPI(`${base}/api/v2/projects?apiKey=${apiKey}&all=true`) as Promise<any[]>,
        ]);

        // Determine if team feature is available by probing the first project
        let teamAvailable = true;
        const probeTeamsCache = new Map<number, any[]>();
        if (rawProjects.length > 0) {
            try {
                const probeRes = await fetch(`${base}/api/v2/projects/${rawProjects[0].id}/teams?apiKey=${apiKey}`);
                if (!probeRes.ok) {
                    teamAvailable = false;
                } else {
                    const probeData = await probeRes.json();
                    if (Array.isArray(probeData)) {
                        probeTeamsCache.set(rawProjects[0].id, probeData);
                    }
                }
            } catch {
                teamAvailable = false;
            }
        }

        const usersMap = new Map<number, any>(rawUsers.map((u: any) => [u.id, enhanceUser(u)]));
        const finalProjects: any[] = [];
        
        // 2. For each project, fetch its users & teams
        // GET /api/v2/projects/:id/teams returns members directly, no need for separate team detail calls
        // using concurrency limit to prevent complete rate limiting immediately
        const CONCURRENT = 3;
        for (let i = 0; i < rawProjects.length; i += CONCURRENT) {
            const batch = rawProjects.slice(i, i + CONCURRENT);
            await Promise.all(batch.map(async (proj: any) => {
                let outUsers: any[] = [];
                let outTeams: any[] = [];
                let teamError: string | null = null;
                
                try {
                    // Fetch Users in Project
                    const pUsers = await fetchAPI(`${base}/api/v2/projects/${proj.id}/users?apiKey=${apiKey}`);
                    outUsers = pUsers.map((u: any) => {
                        const existingInfo = usersMap.get(u.id);
                        if (existingInfo) {
                            existingInfo.joinedProjectCount++;
                            existingInfo.joinedProjects.push({ id: proj.id, name: proj.name, projectKey: proj.projectKey });
                            return Object.assign({}, existingInfo); // clone representation
                        }
                        return enhanceUser(u);
                    });
                } catch(e) {
                    console.warn(`Failed to fetch users for project ${proj.id}`, e);
                }
                    
                if (teamAvailable) {
                    try {
                        // Use cached probe result for the first project, fetch for the rest
                        let pTeams: any[];
                        const cached = probeTeamsCache.get(proj.id);
                        if (cached) {
                            pTeams = cached;
                        } else {
                            pTeams = await fetchAPI(`${base}/api/v2/projects/${proj.id}/teams?apiKey=${apiKey}`);
                        }
                        if (Array.isArray(pTeams)) {
                            outTeams = pTeams.map((pt: any) => ({
                                id: pt.id,
                                name: pt.name,
                                updated: pt.updated,
                                members: (pt.members || []).map((m: any) => enhanceUser(m))
                            }));
                        }
                    } catch(e: any) {
                        teamError = e.message || 'Unknown error';
                        console.warn(`Failed to fetch teams for project ${proj.id}`, e);
                    }
                }

                let adminUserIds: number[] = [];
                try {
                    const pAdmins = await fetchAPI(`${base}/api/v2/projects/${proj.id}/administrators?apiKey=${apiKey}`) as any[];
                    adminUserIds = pAdmins.map((a: any) => a.id);
                } catch(e) {
                    console.warn(`Failed to fetch admins for project ${proj.id}`, e);
                }
                    
                finalProjects.push({
                    id: proj.id,
                    projectKey: proj.projectKey,
                    name: proj.name,
                    archived: proj.archived,
                    users: outUsers,
                    teams: outTeams,
                    adminUserIds,
                    teamError
                });
            }));
        }
        
        // Re-Fetch Rate Limits at the very end to be accurate
        try {
            rateLimitRes = await fetchAPI(`${base}/api/v2/rateLimit?apiKey=${apiKey}`);
        } catch(e) { }

        return c.json({
            users: Array.from(usersMap.values()),
            projects: finalProjects,
            rateLimit: rateLimitRes ? rateLimitRes.rateLimit : null,
            teamAvailable,
            licence: licence || null
        });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default app;
