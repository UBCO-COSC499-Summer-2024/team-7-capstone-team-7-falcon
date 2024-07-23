export const datePickerTheme = {
  root: {
    input: {
      field: {
        input: {
          colors: {
            gray: "border-gray-300 bg-white text-dark-900 focus:border-purple-700 focus:ring-1 focus:ring-purple-700 focus:border-purple-700",
          },
        },
      },
    },
  },
  popup: {
    footer: {
      button: {
        clear:
          "border-0 bg-purple-700 text-white rounded-lg p-2 hover:bg-purple-800",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          base: "text-dark-900 rounded p-1 hover:bg-purple-100 hover:text-purple-700",
          selected: "bg-purple-700 text-white",
        },
      },
    },
    months: {
      items: {
        item: {
          base: "text-dark-900 rounded-lg p-2 hover:text-purple-700",
          selected: "bg-purple-700 text-white",
        },
      },
    },
    years: {
      items: {
        item: {
          base: "text-dark-900 rounded-lg p-1 hover:text-purple-700",
          selected: "bg-purple-700 text-white",
        },
      },
    },
    decades: {
      items: {
        item: {
          base: "text-dark-900 rounded-lg p-2 hover:text-purple-700",
          selected: "bg-purple-700 text-white",
        },
      },
    },
  },
};
