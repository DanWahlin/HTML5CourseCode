//Constructor defines properties and inits object
var Calculator = function (cn, eq) {
    this.currNumberCtl = cn;
    this.eqCtl = eq;
};

Calculator.prototype = function () {
    var operator = null,
        operatorSet = false,
        equalsPressed = false,
        lastNumber = null,

        add = function (x, y) {
            return x + y;
        },

        subtract = function (x, y) {
            return x - y;
        },

        multiply = function (x, y) {
            return x * y;
        },

        divide = function (x, y) {
            if (y == 0) {
                alert("Can't divide by 0");
            }
            return x / y;
        },

        setVal = function (val, thisObj) {
            thisObj.currNumberCtl.innerHTML = val;
        },

        setEquation = function (val, thisObj) {
            thisObj.eqCtl.innerHTML = val;
        },

        clearNumbers = function () {
            lastNumber = null;
            equalsPressed = operatorSet = false;
            setVal('0',this);
            setEquation('',this);
        },

        setOperator = function (newOperator) {
            if (newOperator == '=') {
                equalsPressed = true;
                calculate(this);
                setEquation('',this);
                return;
            }

            //Handle case where = was pressed
            //followed by an operator (+, -, *, /)
            if (!equalsPressed) calculate(this);
            equalsPressed = false;
            operator = newOperator;
            operatorSet = true;
            lastNumber = parseFloat(this.currNumberCtl.innerHTML);
            var eqText = (this.eqCtl.innerHTML == '') ?
                lastNumber + ' ' + operator + ' ' :
                this.eqCtl.innerHTML + ' ' + operator + ' ';
            setEquation(eqText,this);
        },

        numberClick = function (e) {
            var button = (e.target) ? e.target : e.srcElement;
            if (operatorSet == true || 
                this.currNumberCtl.innerHTML == '0') {
                setVal('', this);
                operatorSet = false;
            }
            setVal(this.currNumberCtl.innerHTML + button.innerHTML, this);
            setEquation(this.eqCtl.innerHTML + button.innerHTML, this);
        },

        calculate = function (thisObj) {
            if (!operator || lastNumber == null) return;
            var displayedNumber = parseFloat(thisObj.currNumberCtl.innerHTML),
                newVal = 0;
            //eval() would've made this a whole lot simpler
            //but didn't want to use it in favor of a more
            //"robust" set of methods to demo patterns
            switch (operator) {
                case '+':
                    newVal = add(lastNumber, displayedNumber);
                    break;
                case '-':
                    newVal = subtract(lastNumber, displayedNumber);
                    break;
                case '*':
                    newVal = multiply(lastNumber, displayedNumber);
                    break;
                case '/':
                    newVal = divide(lastNumber, displayedNumber);
                    break;
            }
            setVal(newVal, thisObj);
            lastNumber = newVal;
        };

    return {
        numberClick: numberClick,
        setOperator: setOperator,
        clearNumbers: clearNumbers
    };
} ();