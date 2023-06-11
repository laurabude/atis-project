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
    routeLink: 'home',
    icon: 'fa fa-home',
    label: 'Home',
  },
  {
    routeLink: 'atis-report',
    icon: 'fa-plane fa',
    label: 'Airports',
    subtags: subTags,
  },
  {
    routeLink: 'map',
    icon: 'fa fa-globe',
    label: 'Map',
  },
  {
    routeLink: 'user',
    icon: 'fa fa-cog',
    label: 'Settings',
  },
];
