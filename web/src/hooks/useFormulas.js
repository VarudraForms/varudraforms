// All reverse calculations from SPC Excel — PRODUCTION REP sheet
// Opening birds = yesterday open - yesterday mortality - yesterday cull
export const calcOpenBirds = (prev) => {
if (!prev) return 0
return (prev.openBirds || 0) - (prev.mortality || 0) - (prev.cullTransfer || 0)
}
// Production % = (eggs collected / open birds) * 100
export const calcProPercent = (eggs, birds) => {
if (!birds || birds === 0) return 0
return parseFloat(((eggs / birds) * 100).toFixed(2))
}
// % Diff from standard = actual% - std% (positive=good, negative=bad)
export const calcDiffPercent = (actualPct, stdPct) => {
return parseFloat((actualPct - stdPct).toFixed(2))
}
// Egg stock balance = yesterday balance + today production - sales
export const calcEggBalance = (prev, production, saleBox, saleTray, packingWaste) => {
const prevBalance = prev?.eggBalance || 0
return prevBalance + production - (saleBox * 210) - saleTray - (packingWaste || 0)
}
// Tray balance = yesterday balance + purchased + nishi returned - used
export const calcTrayBalance = (prev, purchased, nishiRec, usedToNishi) => {
const prevBalance = prev?.trayBalance || 1060
return prevBalance + (purchased || 0) + (nishiRec || 0) - (usedToNishi || 0)
}
// Feed per bird per day (grams) = (feedKg / birds) * 1000
export const calcFeedPerBird = (feedKg, birds) => {
if (!birds || birds === 0) return 0
return parseFloat(((feedKg / birds) * 1000).toFixed(1))
}
// Feed per egg = feedKg / eggs produced
export const calcFeedPerEgg = (feedKg, eggs) => {
if (!eggs || eggs === 0) return 0
return parseFloat((feedKg / eggs).toFixed(3))
}

// Bird age in weeks.days format from placement date
export const calcBirdAge = (placementDateStr) => {
if (!placementDateStr) return 0
const placed = new Date(placementDateStr)
const today = new Date()
const days = Math.floor((today - placed) / (1000 * 60 * 60 * 24))
const weeks = Math.floor(days / 7)
const remDays = days % 7
return parseFloat(`${weeks}.${remDays}`)
}
// Sale invoice: total eggs = boxes * 210 eggs per box
export const calcTotalEggs = (boxes) => boxes * 210
// Sale invoice: TCS = msgAmount * 0.001 (0.1%)
export const calcTCS = (msgAmount) => parseFloat((msgAmount * 0.001).toFixed(0))
// Traffic light: green +ve, yellow 0, red -ve (for % diff display)
export const getTrafficLight = (diff) => {
if (diff > 0) return 'green'
if (diff < -2) return 'red'
return 'yellow'
}
// Validate mortality — alert if > 2% of flock (unusual)
export const validateMortality = (mortality, openBirds) => {
const pct = (mortality / openBirds) * 100
if (pct > 2) return { valid: false, msg: 'Mortality seems high — please recheck' }
return { valid: true, msg: null }
}