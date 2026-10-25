const rowsEl = document.getElementById("resultRows");
const sample = [
  {name:"Hemoglobin",value:"10.8",unit:"g/dL",low:"12",high:"16"},
  {name:"WBC",value:"7.2",unit:"10^3/µL",low:"4",high:"11"},
  {name:"Platelets",value:"260",unit:"10^3/µL",low:"150",high:"400"},
  {name:"Fasting glucose",value:"128",unit:"mg/dL",low:"70",high:"99"},
  {name:"LDL cholesterol",value:"142",unit:"mg/dL",low:"0",high:"129"},
  {name:"Vitamin D",value:"18",unit:"ng/mL",low:"30",high:"100"}
];
function addRow(data={name:"",value:"",unit:"",low:"",high:""}) {
  const tr=document.createElement("tr");
  tr.innerHTML=`<td><input aria-label="Test name" placeholder="e.g. Hemoglobin" value="${escapeAttr(data.name)}" data-key="name"></td>
  <td><input aria-label="Result value" type="number" step="any" placeholder="Value" value="${escapeAttr(data.value)}" data-key="value"></td>
  <td><input aria-label="Unit" placeholder="Unit" value="${escapeAttr(data.unit)}" data-key="unit"></td>
  <td><input aria-label="Low reference range" type="number" step="any" placeholder="Low" value="${escapeAttr(data.low)}" data-key="low"></td>
  <td><input aria-label="High reference range" type="number" step="any" placeholder="High" value="${escapeAttr(data.high)}" data-key="high"></td>
  <td><button class="remove-row" title="Remove test" aria-label="Remove test">×</button></td>`;
  tr.querySelector(".remove-row").addEventListener("click",()=>tr.remove());
  rowsEl.appendChild(tr);
}
function escapeAttr(v){return String(v??"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function getRows(){
 return [...rowsEl.querySelectorAll("tr")].map(tr=>{
  const d={};tr.querySelectorAll("[data-key]").forEach(i=>d[i.dataset.key]=i.value.trim());
  return {...d,num:Number(d.value),lo:Number(d.low),hi:Number(d.high),hasRange:d.low!==""&&d.high!==""&&Number.isFinite(Number(d.low))&&Number.isFinite(Number(d.high))};
 }).filter(r=>r.name&&r.value!==""&&Number.isFinite(r.num));
}
function statusFor(r){if(!r.hasRange)return "unknown";if(r.num<r.lo)return "low";if(r.num>r.hi)return "high";return "normal"}
function nice(n){return Number(n).toLocaleString(undefined,{maximumFractionDigits:3})}
function analyze(){
 const results=getRows();if(!results.length){alert("Please enter at least one test name and numeric result.");return}
 const enriched=results.map(r=>({...r,status:statusFor(r)}));
 const abnormal=enriched.filter(r=>r.status==="high"||r.status==="low");
 const normal=enriched.filter(r=>r.status==="normal");
 const unknown=enriched.filter(r=>r.status==="unknown");
 document.getElementById("resultsSection").classList.remove("hidden");
 document.getElementById("resultSummary").textContent=`Reviewed ${enriched.length} test${enriched.length===1?"":"s"} using the reference ranges entered.`;
 document.getElementById("metricCards").innerHTML=`
 <div class="metric"><span class="metric-label">Tests reviewed</span><strong>${enriched.length}</strong><small>Valid numeric results</small></div>
 <div class="metric ${abnormal.length?"alert":"good"}"><span class="metric-label">Outside range</span><strong>${abnormal.length}</strong><small>Below or above entered range</small></div>
 <div class="metric"><span class="metric-label">Needs range</span><strong>${unknown.length}</strong><small>Reference range not supplied</small></div>`;
 document.getElementById("resultList").innerHTML=enriched.map(r=>{
  const range=r.hasRange?`${nice(r.lo)}–${nice(r.hi)} ${escapeHtml(r.unit)}`:"No reference range supplied";
  const label={normal:"IN RANGE",high:"ABOVE RANGE",low:"BELOW RANGE",unknown:"RANGE NEEDED"}[r.status];
  let width=50;if(r.hasRange&&r.hi>r.lo)width=Math.max(4,Math.min(100,(r.num-r.lo)/(r.hi-r.lo)*100));
  return `<div class="result-item"><div><div class="test-name">${escapeHtml(r.name)}</div><div class="test-range">${range}</div><span class="status ${r.status}">${label}</span></div><div class="bar-track"><div class="bar-fill ${r.status}" style="width:${width}%"></div></div><div class="result-value">${nice(r.num)}<br><small style="font-weight:500;color:#829197">${escapeHtml(r.unit)}</small></div></div>`;
 }).join("");
 document.getElementById("insightsList").innerHTML=buildInsights(enriched);
 document.getElementById("resultsSection").scrollIntoView({behavior:"smooth",block:"start"});
 window.currentReport={date:new Date().toLocaleString(),age:document.getElementById("patientAge").value||"Not supplied",sex:document.getElementById("sex").value,results:enriched};
}
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
function buildInsights(rs){
 const abnormal=rs.filter(r=>r.status==="high"||r.status==="low");
 const byName=n=>rs.find(r=>r.name.toLowerCase().includes(n));
 const cards=[];
 if(!abnormal.length)cards.push(["","No out-of-range values detected","Based only on the reference ranges entered. A result within range does not guarantee that a person is healthy."]);
 abnormal.forEach(r=>cards.push([r.status==="high"||r.status==="low"?"warning":"","Review "+r.name,`${r.status==="high"?"Above": "Below"} the supplied range (${r.hasRange?nice(r.lo)+"–"+nice(r.hi):"range unavailable"} ${r.unit}). Confirm the value, unit, and lab range, then discuss it with a clinician.`]));
 const glucose=byName("glucose"), hemoglobin=byName("hemoglobin"), ldl=byName("ldl"), hdl=byName("hdl"), triglycerides=byName("triglycer");
 if(glucose&&glucose.status==="high")cards.push(["warning","Glucose result is elevated","An elevated glucose result can have several explanations, including whether the test was fasting. Review the test conditions and discuss follow-up with a healthcare professional."]);
 if(hemoglobin&&hemoglobin.status==="low")cards.push(["warning","Hemoglobin is below range","Low hemoglobin can have multiple causes and should be interpreted with other blood count results, symptoms, and clinical history."]);
 if(ldl&&ldl.status==="high")cards.push(["warning","LDL cholesterol is above range","Cardiovascular risk assessment depends on more than one lab result. Discuss overall risk factors and appropriate targets with a clinician."]);
 if(hdl&&triglycerides&&hdl.status==="low"&&triglycerides.status==="high")cards.push(["alert","Multiple lipid indicators flagged","Low HDL and high triglycerides together may warrant a clinician's review alongside LDL, medical history, and overall cardiovascular risk. This is not a diagnosis."]);
 if(glucose&&glucose.status==="high"&&hemoglobin&&hemoglobin.status==="low")cards.push(["warning","More than one result needs review","High glucose and low hemoglobin should be interpreted separately and together in clinical context. This combination alone does not establish a diagnosis."]);
 cards.push(["","Context matters","This demo uses simple range checks and a few illustrative rules. It does not read the full report, validate lab-specific ranges, or provide clinical risk prediction."]);
 return cards.map(([kind,title,body])=>`<div class="insight ${kind}"><b>${escapeHtml(title)}</b><p>${escapeHtml(body)}</p></div>`).join("");
}
document.getElementById("addRowBtn").addEventListener("click",()=>addRow());
document.getElementById("sampleBtn").addEventListener("click",()=>{rowsEl.innerHTML="";sample.forEach(addRow);});
document.getElementById("analyzeBtn").addEventListener("click",analyze);
document.getElementById("downloadBtn").addEventListener("click",()=>{
 if(!window.currentReport){return}
 const r=window.currentReport;
 const lines=["MediScan AI — Educational Report Summary",`Generated: ${r.date}`,`Age: ${r.age}`,`Sex range setting: ${r.sex}`,"","Test,Result,Unit,Low range,High range,Status"];
 r.results.forEach(x=>lines.push([x.name,x.value,x.unit,x.low,x.high,x.status].map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")));
 lines.push("","Disclaimer: Educational prototype only. Not a diagnosis or substitute for professional medical advice.");
 const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mediscan-report-summary.csv";a.click();URL.revokeObjectURL(url);
});
sample.forEach(addRow);
