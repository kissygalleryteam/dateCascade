/**
 * @fileoverview
 * @author
 * @module datecascade
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     *
     * @class Datecascade
     * @constructor
     * @extends Base
     */
    function Datecascade(comConfig) {
        var self = this;
        //调用父类构造函数
        Datecascade.superclass.constructor.call(self, comConfig);
    }
    S.extend(Datecascade, Base, /** @lends Datecascade.prototype*/{

    }, {ATTRS : /** @lends Datecascade*/{

    }});
    return Datecascade;
}, {requires:['node', 'base']});



