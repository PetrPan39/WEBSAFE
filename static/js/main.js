async function getVersions() {
  const url = document.getElementById("url").value;
  const res = await fetch('/api/get_versions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url})
  });
  const versions = await res.json();
  const selects = ['<select id="ts1">', '<select id="ts2">'];
  for (let i = 0; i < versions.length; i++) {
    const [ver, ts] = versions[i];
    const opt = `<option value="${ts}">${ts}</option>`;
    selects[0] += opt;
    selects[1] += opt;
  }
  selects[0] += '</select>'; selects[1] += '</select>';
  document.getElementById("version-selects").innerHTML = selects.join('');
}

async function compare() {
  const url = document.getElementById("url").value;
  const ts1 = document.getElementById("ts1").value;
  const ts2 = document.getElementById("ts2").value;
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url, ts1, ts2})
  });
  const data = await res.json();
  document.getElementById("result").textContent = data.diff || "Žádné rozdíly nebo chyba.";
}

async function analyze() {
  const url = document.getElementById("url").value;
  const timestamp = document.getElementById("ts1").value;
  const res = await fetch('/api/analyze_snapshot', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url, timestamp})
  });
  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}

async function analyzeMedia() {
  const filename = document.getElementById("media-file").value;
  const res = await fetch('/api/analyze_media', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({filename})
  });
  const data = await res.json();
  document.getElementById("media-result").textContent = JSON.stringify(data, null, 2);
}
