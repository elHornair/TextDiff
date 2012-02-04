/*jslint white: true, onevar: true, undef: true, newcap: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4, browser: true, nomen: true */
/*global window, navigator, YUI */

YUI.add('text-diff', function (Y) {

    'use strict';

    /****************************************************************************************/
    /************************************* constructor **************************************/
    /****************************************************************************************/
    function TextDiff(config) {
        TextDiff.superclass.constructor.apply(this, arguments);
    }

    TextDiff.NAME = 'textDiff';

    /****************************************************************************************/
    /************************************ public members ************************************/
    /****************************************************************************************/

    TextDiff.ATTRS = {
        complianceChar: {
            value: ' '
        },
        missingChar: {
            value: 'm'
        },
        additionalChar: {
            value: 'a'
        }
    };

    Y.extend(TextDiff, Y.Base, {

        /****************************************************************************************/
        /*********************************** private members ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /*********************************** private methods ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ event handlers ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ public methods ************************************/
        /****************************************************************************************/

        calculateDiff: function(targetStr, compStr) {
            var diffStr = '',
                targetArray = null,
                compArray = null,
                diffMatrix = [],
                i,
                j;

            // trivial cases
            if (targetStr === compStr) {
                for (i = 0; i < targetStr.length; i++) {
                    diffStr += this.get('complianceChar');
                }
                return diffStr;
            }

            if (compStr.length === 0) {
                for (i = 0; i < targetStr.length; i++) {
                    diffStr += this.get('missingChar');
                }
                return diffStr;
            }

            if (targetStr.length === 0) {
                for (i = 0; i < compStr.length; i++) {
                    diffStr += this.get('additionalChar');
                }
                return diffStr;
            }

            // prepare matrix and comparison-vectors
            targetArray = targetStr.split('');
            compArray = compStr.split('');

            for (i = 0; i <= compStr.length; i++) {
                diffMatrix[i] = [i];
            }

            for (j = 0; j <= targetStr.length; j++) {
                diffMatrix[0][j] = j;
            }

            // calculate difference
            Y.Array.each(compArray, function (compChar, i) {
                Y.Array.each(targetArray, function (targetChar, j) {
                    if (compArray[i] === targetArray[j]) {
                        diffMatrix[i+1][j+1] = diffMatrix[i][j];
                    } else {
                        diffMatrix[i+1][j+1] = Math.min(
                            diffMatrix[i+1][j] + 1,  // a deletion
                            diffMatrix[i][j+1] + 1,  // an insertion
                            diffMatrix[i][j] + 1 // a substitution
                        );
                    }
                });
            });

            return diffMatrix;

        },

        /****************************************************************************************/
        /*********************************** extended methods ***********************************/
        /****************************************************************************************/

        initializer: function(config) {
        },

        destructor : function() {
        }

    });

    Y.namespace('elHornair').TextDiff = TextDiff;

}, '0.1', {requires: ['base']});