export const subTags = [
  {
    routeLink: 'atis-report/enfl',
    label: 'ENFL ARR/DEP',
  },

  {
    routeLink: 'atis-report/sabe',
    label: 'SABE ARR/DEP',
  },
  {
    routeLink: 'atis-report/evra',
    label: 'EVRA ARR/DEP',
  },
];

export const navbarData = [
  {
    routeLink: 'atis-report',
    icon: 'fa fa-plane',
    label: 'Home',
    subtags: subTags,
  },
  {
    routeLink: 'weather-data',
    icon: 'fa-cloud fa',
    label: 'Weather Data',
  },
  {
    routeLink: 'map',
    icon: 'fa fa-globe',
    label: 'Map',
  },
  {
    routeLink: 'settings',
    icon: 'fa fa-cog',
    label: 'Settings',
    loginRequired: true,
  },
];
