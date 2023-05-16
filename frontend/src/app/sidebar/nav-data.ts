export const subTags = [
  {
    routeLink: 'atis-report/enfl',
    label: 'ENFL',
  },
  {
    routeLink: 'atis-report/sabe',
    label: 'SABE',
  },
  {
    routeLink: 'atis-report/evra',
    label: 'EVRA',
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
