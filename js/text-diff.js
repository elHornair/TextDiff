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
        },
        transpositionChar: {
            value: 't'
        }
    };

    Y.extend(TextDiff, Y.Base, {

        /****************************************************************************************/
        /*********************************** private members ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /*********************************** private methods ************************************/
        /****************************************************************************************/

        _constructSingleCharString: function(char, length) {
            var singleCharString = '',
                i;

            for (i = 0; i < length; i++) {
                singleCharString += char;
            }

            return singleCharString;
        },

        /****************************************************************************************/
        /************************************ event handlers ************************************/
        /****************************************************************************************/


        /****************************************************************************************/
        /************************************ public methods ************************************/
        /****************************************************************************************/

        calculateDiff: function(targetStr, compStr) {
            var instance = this,
                initDiff = '',
                diffStr = '',
                targetArray = null,
                compArray = null,
                diffMatrix = [],
                minObj = null,
                i,
                j;

            // trivial cases
            if (targetStr === compStr) {
                return this._constructSingleCharString(this.get('complianceChar'), targetStr.length);
            }

            if (compStr.length === 0) {
                return this._constructSingleCharString(this.get('insertionChar'), targetStr.length);
            }

            if (targetStr.length === 0) {
                return this._constructSingleCharString(this.get('deletionChar'), compStr.length);
            }

            // prepare matrix and comparison-vectors
            targetArray = targetStr.split('');
            compArray = compStr.split('');

            for (i = 0; i <= compStr.length; i++) {
                diffMatrix[i] = [{
                    dist: i,
                    diff: this._constructSingleCharString(this.get('deletionChar'), i)
                }];
            }

            for (j = 0; j <= targetStr.length; j++) {
                diffMatrix[0][j] = {
                    dist: j,
                    diff: this._constructSingleCharString(this.get('insertionChar'), j)
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

                        // transposition
                        if(i > 0 && j > 0 && compChar == targetArray[j-1] && targetChar == compArray[i-1] && diffMatrix[i-1][j-1]['dist'] < minObj['dist']) {
                            minObj = {
                                dist: diffMatrix[i-1][j-1]['dist'] + 1,
                                diff: diffMatrix[i-1][j-1]['diff'] + instance.get('transpositionChar') + instance.get('transpositionChar')
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