import { SENSITIVE_QUERY_KEYS, TRACKABLE_PATHS } from "@/lib/analytics/routes";

const ALLOWED = JSON.stringify(TRACKABLE_PATHS);
const SENSITIVE_KEYS = JSON.stringify(SENSITIVE_QUERY_KEYS);

/**
 * Capture-phase guard registered before hydration. Once a measurement script
 * is active, a click toward any other page does a full document load.
 */
export const HARD_NAVIGATION_SCRIPT = `(function(){var allowed=${ALLOWED};var sensitive=${SENSITIVE_KEYS};document.addEventListener("click",function(event){if(!window.__parentiveTrackers)return;if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;var node=event.target;if(node&&node.nodeType!==1)node=node.parentElement;if(!node||!node.closest)return;var anchor=node.closest("a[href]");if(!anchor)return;if(anchor.target&&anchor.target!=="_self")return;if(anchor.hasAttribute("download"))return;var url;try{url=new URL(anchor.href,window.location.origin);}catch(e){return;}if(url.origin!==window.location.origin)return;if(url.protocol!=="http:"&&url.protocol!=="https:")return;var path=url.pathname;if(path.length>1&&path.charAt(path.length-1)==="/")path=path.slice(0,-1);var blocked=allowed.indexOf(path)===-1||path.indexOf("@")!==-1;function sensitiveParams(search){var params=new URLSearchParams(search);params.forEach(function(value,key){var text=String(value);if(sensitive.indexOf(String(key).toLowerCase())!==-1||text.indexOf("@")!==-1||text.replace(/\\D/g,"").length>=7)blocked=true;});}if(!blocked){var fragment=url.hash.charAt(0)==="#"?url.hash.slice(1):url.hash;if(fragment.indexOf("@")!==-1||fragment.replace(/\\D/g,"").length>=7)blocked=true;if(!blocked)sensitiveParams(fragment);}if(!blocked)sensitiveParams(url.search);if(!blocked)return;event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();window.location.assign(url.href);},true);})();`;
