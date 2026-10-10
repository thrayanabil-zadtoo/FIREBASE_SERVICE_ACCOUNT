import crypto from "crypto";
export type RunnerMode="dry_run"|"integration";
export function createCorrelationId(prefix="darb-eval"){return `${prefix}-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;}
export function normalizeMode(v:unknown):RunnerMode{return v==="integration"?"integration":"dry_run";}
function rank(v:unknown){const x=String(v??"").toLowerCase();return x==="supported"?2:(x==="limited"||x==="conflicted"?1:0);}
export function evaluateObservation(expected:any,actual:any){
 const routeOk=!expected?.route||expected.route===actual?.route;
 const sourceOk=!expected?.source||expected.source===actual?.source;
 const confidenceOk=!expected?.minConfidence||rank(actual?.confidence)>=rank(expected.minConfidence);
 const evidenceOk=expected?.evidenceRequired?actual?.evidenceOk===true:true;
 const citationsOk=expected?.citationsRequired?actual?.citationsOk===true:true;
 return {routeOk,sourceOk,confidenceOk,evidenceOk,citationsOk,passed:routeOk&&sourceOk&&confidenceOk&&evidenceOk&&citationsOk};
}
export function summarizeExecutions(rows:any[]){
 const total=rows.length,passed=rows.filter(r=>r.passed).length;
 const l=rows.map(r=>Number(r.latencyMs)).filter(Number.isFinite),t=rows.map(r=>Number(r.tokens)).filter(Number.isFinite);
 return {total,passed,failed:total-passed,passRate:total?passed/total:0,
 avgLatencyMs:l.length?l.reduce((a,b)=>a+b,0)/l.length:0,avgTokens:t.length?t.reduce((a,b)=>a+b,0)/t.length:0};
}
