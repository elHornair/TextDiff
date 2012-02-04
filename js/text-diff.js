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
            value: '_'
        },
        deletionChar: {
            value: 'd'
        },
        insertionChar: {
            value: 'i'
        },
        substitutionChar: {
            value: 's'
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
            var instance = this,
                diffStr = '',
                targetArray = null,
                compArray = null,
                diffMatrix = [],
                minObj = null,
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
                    diffStr += this.get('insertionChar');
                }
                return diffStr;
            }

            if (targetStr.length === 0) {
                for (i = 0; i < compStr.length; i++) {
                    diffStr += this.get('deletionChar');
                }
                return diffStr;
            }

            // prepare matrix and comparison-vectors
            targetArray = targetStr.split('');
            compArray = compStr.split('');

            for (i = 0; i <= compStr.length; i++) {
                diffMatrix[i] = [{
                    dist: i,
                    diff: ''
                }];
            }

            for (j = 0; j <= targetStr.length; j++) {
                diffMatrix[0][j] = {
                    dist: j,
                    diff: ''
                }
            }

            // calculate difference
            Y.Array.each(compArray, function (compChar, i) {
                Y.Array.each(targetArray, function (targetChar, j) {
                    if (compArray[i] === targetArray[j]) {
                        diffMatrix[i+1][j+1] = {
                            dist: diffMatrix[i][j]['dist'],
                            diff: diffMatrix[i][j]['diff'] + instance.get('complianceChar')
                        }
                    } else {

                        // deletion
                        minObj = {
                            dist: diffMatrix[i][j+1]['dist'] + 1,
                            diff: diffMatrix[i][j+1]['diff'] + instance.get('deletionChar')
                        };

                        // insertion
                        if (diffMatrix[i+1][j]['dist'] < minObj['dist']) {
                            minObj = {
                                dist: diffMatrix[i+1][j]['dist'] + 1,
                                diff: diffMatrix[i+1][j]['diff'] + instance.get('insertionChar')
                            };
                        }

                        // substitution
                        if (diffMatrix[i][j]['dist'] < minObj['dist']) {
                            minObj = {
                                dist: diffMatrix[i][j]['dist'] + 1,
                                diff: diffMatrix[i][j]['diff'] + instance.get('substitutionChar')
                            };
                        }

                        diffMatrix[i+1][j+1] = minObj;

                    }
                });
            });

            return diffMatrix[compStr.length][targetStr.length]['diff'];

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