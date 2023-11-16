"use strict";
window.onload = function() {
    let type_text_quantity = document.querySelectorAll('#mitsumori-js .text-quantity');
    type_text_quantity.forEach((ele)=>{
        ele.onkeyup = event => calcPrice(event);
        ele.onblur = event => calcPrice(event);
    });
    let type_radio_quantity = document.querySelectorAll('#mitsumori-js .radio-quantity');
    type_radio_quantity.forEach((ele)=>{
        ele.onchange = event => calcPrice(event);
    });
    let type_check_quantity = document.querySelectorAll('#mitsumori-js .check-quantity');
    type_check_quantity.forEach((ele)=>{
        ele.onchange = event => calcPrice(event);
    });
    let type_select_quantity = document.querySelectorAll('#mitsumori-js .select-quantity');
    type_select_quantity.forEach((ele)=>{
        ele.onchange = event => calcPrice(event);
    });

    function calcPrice(event) {
        let subtotal=0, tax=0,
        itemNum = event.target.getAttribute('data-itemnum'),
        taxFlg = parseInt(document.querySelector('.mitsumori-js-total-tbl').getAttribute('data-taxflg')),
        items = document.querySelectorAll('.mitsumori-js-item');

        items.forEach((itemElem)=>{
            if (itemElem.getAttribute('data-itemnum') == itemNum) {
                if (event.target.classList.contains('text-quantity')) {
                    itemElem.querySelector('.item-price span').textContent = escapeHtml(event.target.value) * escapeHtml(itemElem.querySelector('.unit-price').value);

                } else if (event.target.classList.contains('radio-quantity')) {
                    itemElem.querySelector('.item-price span').textContent = escapeHtml(event.target.value);

                } else if (event.target.classList.contains('check-quantity')) {
                    let checkLabels = itemElem.querySelectorAll('.check-quantity');
                    let total = 0;
                    checkLabels.forEach((checkLabelElem)=>{
                        if (checkLabelElem.checked) {
                            total += parseInt(escapeHtml(checkLabelElem.value));
                        }
                    });
                    itemElem.querySelector('.item-price span').textContent = total;

                } else if (event.target.classList.contains('select-quantity')) {
                    itemElem.querySelector('.item-price span').textContent = escapeHtml(itemElem.querySelector('.select-quantity').value);

                }
            }
            if (itemElem.querySelector('.item-price span').textContent != '') {
                subtotal += parseInt(itemElem.querySelector('.item-price span').textContent);
            }
        });

        if (taxFlg == 1) {
            tax = subtotal * (parseInt(document.querySelector('#mitsumori-js-tax-rate').textContent) / 100);
            tax = Math.floor(tax);
            document.querySelector('#mitsumori-js-subtotal').textContent = subtotal;
            document.querySelector('#mitsumori-js-tax').textContent = tax;
            document.querySelector('#mitsumori-js-total').textContent = subtotal + tax;
        } else {
            document.querySelector('#mitsumori-js-total').textContent = subtotal;
        }


        let outputContents = document.querySelectorAll('textarea.mitsumori-js-output');
        outputContents.forEach(function(outputElem) {
            let outputHtml = '', mjItems = document.querySelectorAll('.mitsumori-js-item'), mjTotalItems = document.querySelectorAll('.mitsumori-js-total-tbl tr');
            mjItems.forEach(function(mjElem){
                let txtItemName = mjElem.querySelector('.item-name').textContent,
                    txtItemPrice = mjElem.querySelector('.item-price').textContent;
                if (mjElem.querySelector('.unit-price') != null) {
                    let valUnitPrice = escapeHtml(mjElem.querySelector('.unit-price').value),
                        valTextQuantity = escapeHtml(mjElem.querySelector('.text-quantity').value);
                    if (valUnitPrice != '' && valTextQuantity != '') {
                        outputHtml += txtItemName;
                        outputHtml += '（￥' + valUnitPrice + ' × ' + valTextQuantity + '）';
                        outputHtml += '： ' + txtItemPrice +'\n';
                    }
                }
                if (mjElem.querySelector('.radio-quantity') != null) {
                    let radioItems = mjElem.querySelectorAll('.radio-quantity');
                    radioItems.forEach(function(radioElem){
                        if (radioElem.checked) {
                            let txtRadioItemName = radioElem.parentNode.textContent,
                            valRadioQuantity = escapeHtml(radioElem.value);
                            if (valRadioQuantity != '') {
                                outputHtml += txtItemName;
                                outputHtml += '（' + txtRadioItemName + ' ￥' + valRadioQuantity + '）';
                                outputHtml += '： ' + txtItemPrice +'\n';
                            }
                        }
                    });
                }
                if (mjElem.querySelector('.check-quantity') != null) {
                    let checkItems = mjElem.querySelectorAll('.check-quantity');
                    let checkItemFlg = false, checkItemContents = '';
                    checkItems.forEach(function(checkElem){
                        if (checkElem.checked) {
                            let txtCheckItemName = checkElem.parentNode.textContent,
                                valCheckQuantity = escapeHtml(checkElem.value);
                            if (valCheckQuantity != '') {
                                if (!checkItemFlg) {
                                    checkItemContents += txtCheckItemName + '：￥' + valCheckQuantity;
                                } else {
                                    checkItemContents += ', ' + txtCheckItemName + '：￥' + valCheckQuantity;
                                }
                            }
                            checkItemFlg = true;
                        }
                    });
                    if (checkItemFlg) {
                        outputHtml += txtItemName + '\n';
                        outputHtml += '（' + checkItemContents + '）\n';
                        outputHtml += '： ' + txtItemPrice +'\n';
                    }
                }
                if (mjElem.querySelector('.select-quantity') != null) {
                    let optItems = mjElem.querySelectorAll('.select-quantity option');
                    optItems.forEach(function(optElem){
                        if (optElem.selected) {
                            let txtOptName = optElem.textContent,
                            valOpt = escapeHtml(optElem.value);
                            if (valOpt != '') {
                                outputHtml += txtItemName;
                                outputHtml += '（' + txtOptName + ' ￥' + valOpt + '）';
                                outputHtml += '： ' + txtItemPrice +'\n';
                            }
                        }
                    });
                }
            });
            outputHtml += '\n\n';
            mjTotalItems.forEach(function(mjtElem){
                outputHtml += mjtElem.querySelector('th').textContent + mjtElem.querySelector('td').textContent + '\n';
            });
            outputElem.textContent = outputHtml;
        });
    }

    function escapeHtml(str) {
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#39;');
        return str;
    }
}
