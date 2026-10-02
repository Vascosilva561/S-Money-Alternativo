import OitoOitoOitoBetIcon from "@/assets/services/888bet";
import AfricellIcon from "@/assets/services/africel";
import BantubetIcon from "@/assets/services/bantubet";
import DstvIcon from "@/assets/services/dstv";
import ElephantbetIcon from "@/assets/services/elephantbet";
import EndeIcon from "@/assets/services/ende";
import KwanzabetIcon from "@/assets/services/kwanzabet";
import MobetIcon from "@/assets/services/mobet";
import MovicelIcon from "@/assets/services/movicel";
import PremierbetIcon from "@/assets/services/premierbet";
import UnitelIcon from "@/assets/services/unitel";
import ZapIcon from "@/assets/services/zap";
import ZapfibraIcon from "@/assets/services/zapFibra";

export default function GetServicesIcon(service:string){
    switch (service){
        case "UNITEL":
            return <UnitelIcon/>
        case "ENDE":
            return <EndeIcon />
        case "MOVICEL":
            return <MovicelIcon/>
        case "AFRICELL":
            return <AfricellIcon/>
        case "ELEPHANTBET":
            return <ElephantbetIcon/>
        case "DSTV":
            return <DstvIcon/>
        case "BANTUBET":
            return <BantubetIcon/>
        case "ZAP":
            return <ZapIcon/>
        case "ZAP FIBRA":
            return <ZapfibraIcon/>
        case "888BET":
            return <OitoOitoOitoBetIcon/>
        case "PREMIERBET":
            return <PremierbetIcon/>
        case "KWANZABET":
            return <KwanzabetIcon/>
        case "MOBET":
            return <MobetIcon/>
        default:
            return <></>
    }
}