/**
 * @fileOverview A partical object for a date utility.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Date Utility
// ================================================================

/**
 * A wrapper for date and time.
 * @public
 * @constructor
 * @param {(Date|number|string)=} opt_date A wrapped {@code Date} object, an
 *     epoch time, or a constructor-parsable string (default to "now").
 */
kclv.Date = function(opt_date) {
    /**
     * A wrapped Date object.
     * @private {Date}
     * @const
     */
    this.date_ = new Date(opt_date);

    return;
};

/**
 * Get a string representing the date and time.
 * @public
 * @returns {string} A string representing the its own {@code Date} object.
 * @nosideeffects
 */
kclv.Date.prototype.toString = function() {
    return this.date_.toString();
};

/**
 * Get a string representing the period of its own date by the specified
 *     frequency.
 * @public
 * @param {string} frequency A string representing the frequency.
 * @returns {string} A string representing the period of its own date.
 * @throws {kclv.Exception.InvalidFrequency} If the specified frequency is
 *     invalid.
 * @nosideeffects
 */
kclv.Date.prototype.toPeriod = function(frequency) {
    switch (frequency) {
        case 'Yearly':
            return {
                v : this.toNewYearsDay_(),
                f : this.date_.getFullYear().toString()
            };
        case 'Monthly':
            return {
                v : this.toFirstDayOfMonth_(),
                f : this.date_.getFullYear() + '/' +
                    this.zeroPad_( this.date_.getMonth() + 1 )
            };
        case 'Weekly':
            return {
                v : this.toMonday_(),
                f : this.toWeekString()
            };
        case 'Daily':
            return {
                v : this.toMidnight_(),
                f : this.date_.getFullYear() + '/' +
                    this.zeroPad_( this.date_.getMonth() + 1 ) + '/' +
                    this.zeroPad_( this.date_.getDate() )
            };
        default:
            throw new kclv.Exception.InvalidFrequency(frequency);
    }
};

/**
 * Get a string representing the full year and week number.
 *     Default format is {@code YYYY-Www}, complied ISO 8601.
 * @public
 * @param {string=} opt_token A delimiter of full year and week number
 *     (Default to {@code -W}).
 *     Note: You can use an empty string {@code ''}.
 * @returns {string} A year and number string.
 *     (ex. {@code 2013-52}, {@code 2014-01}, etc.).
 * @nosideeffects
 * @see #toWeek
 */
kclv.Date.prototype.toWeekString = function(opt_token) {
    if (opt_token === undefined) {
        opt_token = '-W'; // ISO 8601
    }

    var week = this.toWeek();

    return [ week[0], this.zeroPad_(week[1]) ].join(opt_token);
};

/**
 * Get full year and week number as array.
 *     According to ISO 8601, a week starts on Monday, and the first week of a
 *     year contains the first Thursday of the year.
 * @public
 * @returns {Array.<number>} Full year (ex. {@code 2014}) and week number
 *     (ex. {@code 1}, {@code 53}).
 *     Note: Type of these elements are {@code number}. Week number isn't to be
 *     zero-padded.
 * @nosideeffects
 * @see #toWeekString
 */
kclv.Date.prototype.toWeek = function() {
    var year = this.date_.getFullYear(),
        dayOfNewYearsDay = this.getDayOfNewYearsDay_(),
        // Elapsed weeks since the New Year's Day of the year.
        week =
            Math.floor( ( this.getDayOfYear_() + dayOfNewYearsDay - 1 ) / 7 );

    if ( dayOfNewYearsDay <= 4 ) {
        // The New Year's Day of the year is in the first week of the year.
        ++ week;
    }

    if ( week === 0 ) {
        // The last week of the last year.
        return [ -- year, this.getWeekPerYear_(year) ];
    }

    if ( week === 53 && this.getWeekPerYear_(year) === 52 ) {
        // The first week of the next year.
        return [ ++ year, 1 ];
    }

    return [year, week];
};

/**
 * Get the amount of weeks in the specified year.
 *     If the day of the last day of the year is Thursday, the last week of the
 *     year "erodes" some days of the next year, then the year has 53 weeks.
 *     Otherwise, the year has 52 weeks.
 *     The logic requires that if the day of a New Year's Day is Thursday in a
 *     common year, or is Wednesday or Thursday in a leap year.
 * @private
 * @param {number} year The specified year.
 * @returns {number} The amount of week in the specified year.
 *     It is {@code 53} or {@code 52}.
 * @nosideeffects
 */
kclv.Date.prototype.getWeekPerYear_ = function(year) {
    var dayOfNewYearsDay = this.getDayOfNewYearsDay_(year);

    return dayOfNewYearsDay === 4 ||                          // Both years.
           ( dayOfNewYearsDay === 3 && this.isLeapYear_() ) ? // A leap year.
        53 : 52;
};

/**
 * Get elapsed days since the New Year's Day of the year.
 *     Note: Any time of a day (00:00:00 - 23:59:59) are comprised in the day.
 *     TODO: Take leap second (UTC 23:59:60 = JST 08:59:60) into consideration.
 * @private
 * @returns {number} Elapsed days since the New Year's Day of the year
 *     (ex. {@code 0}, {@code 42}, {@code 365}, {@code 366}, etc.).
 * @nosideeffects
 */
kclv.Date.prototype.getDayOfYear_ = function() {
    return Math.floor(
        ( this.date_ - this.toNewYearsDay_() ) / 86400000 // 60*60*24*1000
    );
};

/**
 * Get day of the New Year's Day of the year.
 * @private
 * @returns {number} Day of the New Year's Day of the the year (ex. {@code 0}
 *     (Sunday), {@code 1} (Monday), {@code 6} (Saturday), etc.).
 * @nosideeffects
 */
kclv.Date.prototype.getDayOfNewYearsDay_ = function(opt_year) {
    return this.toNewYearsDay_(opt_year).getDay();
};

/**
 * Generate and get a {@code Date} object of the New Year's Day of the year.
 * @private
 * @param {number=} opt_year The alternative year.
 * @returns {Date} Date of the New Year's Day of the year.
 * @nosideeffects
 */
kclv.Date.prototype.toNewYearsDay_ = function(opt_year) {
    return new Date(opt_year || this.date_.getFullYear(), 0, 1);
};

/**
 * Generate and get a {@code Date} object of the first day of the month.
 * @private
 * @returns {Date} Date of the first day of the month.
 * @nosideeffects
 */
kclv.Date.prototype.toFirstDayOfMonth_ = function() {
    return new Date(this.date_.getFullYear(), this.date_.getMonth(), 1);
};

/**
 * Generate and get a {@code Date} object of the first day (Monday) of the
 *     week.
 * @private
 * @returns {Date} Date of the first day (Monday) of the week.
 * @nosideeffects
 */
kclv.Date.prototype.toMonday_ = function() {
    return new Date( this.toMidnight_().setDate(
        this.date_.getDate() - (
            this.date_.getDay() ?
                this.date_.getDay() - 1 : // Monday (1) to Saturday (6).
                6                         // Sunday (0) is the last day.
        )
    ) );
};

/**
 * Generate and get a {@code Date} object of midnight of the day.
 * @private
 * @returns {Date} Date of midnight of the day.
 * @nosideeffects
 */
kclv.Date.prototype.toMidnight_ = function() {
    return new Date(
        this.date_.getFullYear(), this.date_.getMonth(), this.date_.getDate()
    );
};

/**
 * Check whether its own year is a leap year.
 * @private
 * @returns {boolean} Whether its own year is a leap year.
 * @nosideeffects
 */
kclv.Date.prototype.isLeapYear_ = function() {
    var year = this.date_.getFullYear();

    return ( year % 4 === 0 ) &&
           ( ( year % 100 !== 0 ) || year % 400 === 0 );
};

/**
 * Pad the specified number by the zero (0) character.
 * @private
 * @param {number} A number.
 * @returns {string} A zero-padded number.
 * @nosideeffects
 */
kclv.Date.prototype.zeroPad_ = function(number) {
    return [ '0', number ].join('').slice(-2);
};
