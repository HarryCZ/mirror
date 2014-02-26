var mtl = [
    {
        "title": "storage",
        "cz": "Sklad",
        "en": "Storage"
    },
    {
        "title": "purchases",
        "cz": "Nákupy",
        "en": "Purchases"
    },
    {
        "title": "storage_items",
        "cz": "Položky skladu",
        "en": "Storage items"
    },
    {
        "title": "units",
        "cz": "Jednotky",
        "en": "Units"
    },
    {
        "title": "title",
        "cz": "Název",
        "en": "Title"
    },
    {
        "title": "amount",
        "cz": "Množství",
        "en": "Amount"
    },
    {
        "title": "package",
        "cz": "Balení",
        "en": "Package"
    },
    {
        "title": "package_unit",
        "cz": "Jednotka bal.",
        "en": "Pkg. unit"
    },
    {
        "title": "ration",
        "cz": "Porce",
        "en": "Ration"
    },
    {
        "title": "ration_unit",
        "cz": "Jedn. porce",
        "en": "Ration unit"
    },
    {
        "title": "sell_price",
        "cz": "Prodej. cena",
        "en": "Sell price"
    },
    {
        "title": "add_storage_item",
        "cz": "Přidat položku skladu",
        "en": "Add storage item"
    },
    {
        "title": "submit",
        "cz": "Potvrdit",
        "en": "Submit"
    },
    {
        "title": "sign",
        "cz": "Značka",
        "en": "Sign"
    },
    {
        "title": "subunit",
        "cz": "Podjednotka",
        "en": "Subunit"
    },
    {
        "title": "subunit_sign",
        "cz": "Značka podjed.",
        "en": "Subunit sign"
    },
    {
        "title": "conversion",
        "cz": "Přepočet",
        "en": "Conversion"
    }
];

function replaceMtl(lang) {
	var mtlContainers = $('mtl');
	var i = 0;
	while (mtlContainers[i]) {
		var str = $(mtlContainers[i]).text();
		var j = 0;
		var matched = 0;
		while ((mtl[j])&&(matched==0)) {
			if (mtl[j].title == str) {
				switch (lang) {
					case 'cz':
						$(mtlContainers[i]).text(mtl[j].cz);
						break;
					case 'en':
					default:
						$(mtlContainers[i]).text(mtl[j].en);
						break;
				}
				matched++;
			}
			j++;
		}
		i++;
	}
}

function replaceMtlFormInput(lang) {
	var mtlContainers = $('input');
	var i = 0;
	while (mtlContainers[i]) {
		var str = $(mtlContainers[i]).attr('placeholder');
		var j = 0;
		var matched = 0;
		while ((mtl[j])&&(matched==0)) {
			if (mtl[j].title == str) {
				switch (lang) {
					case 'cz':
						$(mtlContainers[i]).attr('placeholder',mtl[j].cz);
						break;
					case 'en':
					default:
						$(mtlContainers[i]).attr('placeholder',mtl[j].en);
						break;
				}
				matched++;
			}
			j++;
		}
		i++;
	}
}

function replaceMtlFormSelect(lang) {
	var mtlContainers = $('select');
	var i = 0;
	while (mtlContainers[i]) {
		var str = $(mtlContainers[i]).attr('placeholder');
		var j = 0;
		var matched = 0;
		while ((mtl[j])&&(matched==0)) {
			if (mtl[j].title == str) {
				switch (lang) {
					case 'cz':
						$(mtlContainers[i]).attr('placeholder',mtl[j].cz);
						break;
					case 'en':
					default:
						$(mtlContainers[i]).attr('placeholder',mtl[j].en);
						break;
				}
				matched++;
			}
			j++;
		}
		i++;
	}
}

function replaceMtlFormButton(lang) {
	var mtlContainers = $('button');
	var i = 0;
	while (mtlContainers[i]) {
		var str = $(mtlContainers[i]).text();
		var j = 0;
		var matched = 0;
		while ((mtl[j])&&(matched==0)) {
			if (mtl[j].title == str) {
				switch (lang) {
					case 'cz':
						$(mtlContainers[i]).text(mtl[j].cz);
						break;
					case 'en':
					default:
						$(mtlContainers[i]).text(mtl[j].en);
						break;
				}
				matched++;
			}
			j++;
		}
		i++;
	}
}

function replaceMtlFormCtrl(input,select,button,lang){
	if (input) replaceMtlFormInput(lang); 
	if (select) replaceMtlFormSelect(lang); 
	if (button) replaceMtlFormButton(lang); 
}

$(document).ready(function(){
	var lang = 'cz';
	replaceMtl(lang);
	if ($('form')) replaceMtlFormCtrl(1,1,1,lang);
});