//Credit to MrRedShark77
//Created in IMR v0.6.3.4
//https://github.com/MrRedShark77/incremental-mass-rewritten/blob/main/js/tooltip.js

var tooltips, hover_tooltip, tooltip_div, tt_time = 0;

const TOOLTIP_CONFING = {
	padding_x: 5,
	padding_y: 5,
	def_align: 'left',
	def_pos: 'bottom',
	def_text_align: 'left',
}

function updateTooltips() {
	let style = tooltip_div.style

	if (hover_tooltip) {
		tt_time = Math.min(1,tt_time+diff/500)
		style.display = 'block';

		attr_align = hover_tooltip.getAttribute('tooltip-align') || TOOLTIP_CONFING.def_align,
		attr_pos = hover_tooltip.getAttribute('tooltip-pos') || TOOLTIP_CONFING.def_pos,
		text_align = hover_tooltip.getAttribute('tooltip-text-align') || TOOLTIP_CONFING.def_text_align;

		let ht_rect = hover_tooltip.getBoundingClientRect()
		let t_rect = tooltip_div.getBoundingClientRect()

		let [dx,dy] = [0,0]

		if (attr_pos == 'bottom') dy = ht_rect.bottom + 8*tt_time
		else if (attr_pos == 'top') dy = ht_rect.top - t_rect.height - 8*tt_time

		if (attr_align == 'left') dx = ht_rect.left
		else if (attr_align == 'center') dx = ht_rect.left + (ht_rect.width - t_rect.width) / 2
		else if (attr_align == 'right') {
			dx = ht_rect.right - t_rect.width
		}

		style.top = Math.max(TOOLTIP_CONFING.padding_y,dy) + window.scrollY
		style.left = Math.max(TOOLTIP_CONFING.padding_x,Math.min(window.innerWidth-t_rect.width-TOOLTIP_CONFING.padding_x,dx)) + window.scrollX
		style['text-align'] = text_align

		let tr_data = TOOLTIPS[hover_tooltip.id.split("_tooltip")[0]]
		tooltip_div.innerHTML = `<h2><b>${tr_data.full}</b></h2>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():"")
	} else {
		style.display = 'none';
		style.top = 0;
		style.left = 0;
		tt_time = 0
	}

	style.opacity = tt_time;
}

function setupTooltips() {
	tooltips = document.getElementsByClassName('tooltip')
	tooltip_div = document.getElementById('tooltip-div')
	for (let tooltip of tooltips) {
		tooltip.onmouseenter = function() {
			hover_tooltip = tooltip
			updateTooltips()
		}
		tooltip.onmouseleave = function() {
			hover_tooltip = null
			updateTooltips()
		}
	}

	setInterval(updateTooltips,1000/30)
}