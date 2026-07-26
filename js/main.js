/**
 *  Grouping of checkboxes (include and exclude)
 */
class CheckboxGroup {
    /**
     * @param {Map<string, number>} ids The IDs for this grouping
     */
    constructor(ids) {
        this.ids = ids;
        this.include = new Map();
        this.exclude = new Map();
    }

    /**
     * Creates a listener for either this.include or this.exclude
     * depending on if `checkboxes` is `"include"` or `"exclude`
     *
     * @param {"include" | "exclude"} checkboxes
     */
    updateListener(checkboxes) {
        const targetMap = checkboxes == "include" ? this.include : this.exclude;

        function updater(event) {
            const target = event.target;
            targetMap.set(target.id, target.checked);
        }

        return updater;
    }

    /**
     * Adds a listener to the form with the given ID, either `include` or `exclude`
     *
     * @param {string} formID The ID of the form which needs to be listened to
     * @param {"include" | "exclude"} checkboxes the checkboxes (`this.include` or `this.exclude`) to listen to
     */
    addListener(formID, checkboxes) {
        const form = document.getElementById(formID);
        form.addEventListener("change", this.updateListener(checkboxes));
    }
}

/* Categories */

const categoryIDs = new Map([
    ["ff", 116],
    ["fm", 22],
    ["gen", 21],
    ["mm", 23],
    ["multi", 2246],
    ["other", 24],
]);

const categoryGroup = new CheckboxGroup(categoryIDs);
categoryGroup.addListener("include-category-form", "include");
categoryGroup.addListener("exclude-category-form", "exclude");

/* Warnings */

const warningIDs = new Map([
    ["chose-none", 14],
    ["graphic-violence", 17],
    ["major-death", 18],
    ["none", 16],
    ["rape", 19],
    ["underage", 20],
]);

const warningGroup = new CheckboxGroup(warningIDs);
warningGroup.addListener("include-warning-form", "include");
warningGroup.addListener("exclude-warning-form", "exclude");

/* Ratings */

const ratingIDs = new Map([
    ["not-rated", 9],
    ["ga", 10],
    ["teen", 11],
    ["mature", 12],
    ["explicit", 13],
]);

const ratingGroup = new CheckboxGroup(ratingIDs);
ratingGroup.addListener("include-rating-form", "include");

/* Actual output updating */

const output = document.getElementById("output");

function updateOutput() {
    // Exclude overrides include
    function update(group, id_string, values) {
        for (const key of group.ids.keys()) {
            if (group.exclude.get(key) ?? false) {
                values.push(`-${id_string}: ${group.ids.get(key)}`);
            } else if (group.include.get(key) ?? false) {
                values.push(`${id_string}: ${group.ids.get(key)}`);
            }
        }
    }

    const spaceSep = [];
    const orSep = [];

    // Updating groups
    update(categoryGroup, "category_ids", spaceSep);
    update(warningGroup, "archive_warning_ids", spaceSep);
    update(ratingGroup, "rating_ids", orSep);

    // OTP button
    const otp = document.getElementById("otp");
    if (otp.checked) {
        spaceSep.push("otp: true");
    }

    let orText = orSep.join(" OR ");
    if (orSep.length >= 2 && spaceSep.length >= 1) {
        orText = `(${orText})`;
    }

    if (orText) {
        spaceSep.push(orText);
    }

    // Updating output
    const newText = spaceSep.join(" ");
    if (newText) {
        output.textContent = newText;
    } else {
        output.textContent = "";
    }
}

document.addEventListener("change", updateOutput);
document.addEventListener("pageshow", updateOutput);
