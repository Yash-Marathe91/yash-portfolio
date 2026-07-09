import HeroScene from '@/components/HeroScene';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import ProjectGridClient from '@/components/ProjectGridClient';
import Reveal from '@/components/Reveal';
import TrueFocus from '@/components/TrueFocus';
import GlitchText from '@/components/GlitchText';
import { ArrowRight, Terminal, LineChart, Code2, Target, Award, Zap, MonitorPlay, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.33-.35-.76-.53-1.09A.09.09 0 0 0 9 4c-1.5.26-2.94.71-4.27 1.33a.08.08 0 0 0-.04.03C1.51 10.02.65 14.54 1 19.06c0 .02.01.04.03.05a18.23 18.23 0 0 0 5.48 2.75.08.08 0 0 0 .09-.03c.32-.44.61-.9.88-1.38a.08.08 0 0 0-.04-.11 11.83 11.83 0 0 1-1.72-.82.08.08 0 0 1-.01-.13c.12-.09.23-.19.34-.29a.08.08 0 0 1 .08-.01c3.48 1.59 7.23 1.59 10.7 0a.08.08 0 0 1 .08.01c.11.1.22.2.34.29a.08.08 0 0 1-.01.13c-.56.32-1.13.59-1.72.82a.08.08 0 0 0-.04.11c.27.48.56.94.88 1.38a.08.08 0 0 0 .09.03 18.23 18.23 0 0 0 5.49-2.75.08.08 0 0 0 .03-.05c.42-5.32-.82-9.7-3.67-13.7-.01-.01-.03-.03-.05-.03zM8.5 15.1c-1.08 0-1.97-.99-1.97-2.2 0-1.2.87-2.2 1.97-2.2 1.1 0 1.99.99 1.97 2.2 0 1.21-.88 2.2-1.97 2.2zm7 0c-1.08 0-1.97-.99-1.97-2.2 0-1.2.87-2.2 1.97-2.2 1.1 0 1.99.99 1.97 2.2 0 1.21-.88 2.2-1.97 2.2z" />
  </svg>
);

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const KaggleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.1025 7.3475c-.0681 0-.1022.0341-.1022.102v6.752c0 .0681.034.1022.1022.1022h.7049c.068 0 .1022-.034.1022-.1023v-1.481l.4187-.3985 1.5016 1.91c.041.0477.0884.0716.143.0716h.9091c.0476 0 .0748-.0135.0817-.0407.0135-.041.0066-.075-.0206-.1023l-1.9816-2.4618 1.9002-1.8384c.0204-.0205.0237-.051.01-.092-.0137-.0339-.0408-.051-.0816-.051h-.9398c-.0477 0-.0953.024-.143.0716L.9096 11.607V7.4496c0-.0679-.0342-.102-.1022-.102zm18.0417 0c-.068 0-.102.0341-.102.102v6.752c0 .0681.034.102.102.102h.705c.068 0 .102-.034.102-.102v-6.752c0-.068-.034-.102-.102-.102zM5.961 9.6254c-.5653 0-1.11.1806-1.6343.5415-.0545.0545-.0648.102-.0307.143l.3676.5208c.0272.0477.0717.0545.133.0204.3948-.2722.783-.4086 1.1644-.4086.2927 0 .5158.0886.669.2656.1532.1771.2197.3917.1992.6436-.6606.0681-1.1545.1495-1.4813.245-.8308.2383-1.2461.6913-1.2461 1.3586 0 .4222.1533.7695.4598 1.0419.3132.2654.6845.3982 1.1134.3982.4698 0 .8545-.1125 1.1542-.3372v.1432c0 .0682.0374.102.1123.102h.7048c.068 0 .102-.0338.102-.102V11.372c0-.6604-.2245-1.1406-.6739-1.4403-.3065-.2043-.6776-.3063-1.1134-.3063zm4.3225 0c-.6742 0-1.195.2622-1.5627.7865-.3133.4359-.4699.9671-.4699 1.5936 0 .6604.1634 1.2087.4903 1.6444.3744.4972.892.7455 1.5526.7455.5313 0 .9567-.1327 1.2768-.3982v.531c0 .858-.4122 1.287-1.236 1.287-.361 0-.732-.1907-1.1132-.572a.098.098 0 00-.0716-.0306c-.034 0-.0613.0102-.0817.0307l-.4802.48c-.0408.0613-.0375.1124.0103.1532.1361.1157.2554.2129.3576.2911.102.0783.1905.1413.2656.189.354.1975.7284.2961 1.1235.2961.6808 0 1.207-.1925 1.5781-.577.3711-.3848.5567-.9484.5567-1.6903V9.8196c0-.068-.034-.102-.102-.102h-.705c-.0682 0-.1021.034-.1021.102v.2043c-.3471-.2657-.7763-.3985-1.287-.3985zm4.8021 0c-.6742 0-1.195.2622-1.5627.7865-.3132.4359-.4699.9671-.4699 1.5936 0 .6604.1633 1.2087.4903 1.6444.3744.4972.892.7455 1.5526.7455.5311 0 .9566-.1327 1.2768-.3982v.531c0 .858-.4122 1.287-1.236 1.287-.361 0-.732-.1907-1.1133-.572a.098.098 0 00-.0716-.0306c-.034 0-.0612.0102-.0816.0307l-.48.48c-.0409.0613-.0376.1124.01.1532.1363.1157.2555.2129.3576.2911.1021.0783.1906.1413.2657.189.354.1975.7285.2961 1.1237.2961.6808 0 1.2068-.1925 1.5781-.577.371-.3848.5565-.9484.5565-1.6903V9.8196c0-.068-.034-.102-.102-.102h-.7049c-.0682 0-.1022.034-.1022.102v.2043c-.3474-.2657-.7763-.3985-1.287-.3985zm6.7457 0c-.6537 0-1.185.211-1.5936.6332-.4427.4632-.664 1.0283-.664 1.6956 0 .7083.225 1.2905.6743 1.7467.463.463 1.042.6945 1.7366.6945.6467 0 1.2154-.1838 1.7057-.5515.0545-.041.0545-.0884 0-.143l-.4802-.4903c-.041-.0409-.0919-.0409-.1533 0-.2998.2112-.6368.3167-1.0112.3167-.4222 0-.7729-.119-1.052-.3576-.2452-.2248-.3882-.5038-.429-.8375h3.3197c.0679 0 .1022-.0341.1022-.1023l.01-.2244c.0341-.6878-.1668-1.26-.6025-1.7162-.4224-.4426-.9432-.664-1.5627-.664zm-.0206.7865c.3268 0 .6062.1056.8377.3166.2452.211.371.4734.378.7865h-2.4618c.0613-.3269.2077-.5925.4392-.7968.2313-.2042.5004-.3063.8069-.3063zm-11.4249.102c.6196 0 1.0146.2181 1.1848.6538v1.6854c-.1702.4358-.5755.6538-1.2155.6538-.3133 0-.5687-.0986-.7661-.2963-.2656-.2518-.3983-.6538-.3983-1.2053 0-.9941.3984-1.4914 1.1951-1.4914zm4.802 0c.6196 0 1.0148.2181 1.1851.6538h-.0002v1.6854c-.1703.4358-.5755.6538-1.2155.6538-.3132 0-.5686-.0986-.7661-.2963-.2655-.2518-.3983-.6538-.3983-1.2053 0-.9941.3983-1.4914 1.195-1.4914zm-8.3586 1.6547v1.0215c-.286.286-.6675.412-1.1441.3779-.1703-.0135-.32-.0663-.4493-.1582-.1294-.0919-.2045-.2129-.2249-.3627-.0341-.2657.1158-.47.4495-.6129.2452-.1088.7013-.1974 1.3688-.2656z" />
  </svg>
);

const CredlyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.8 13.154a.299.299 0 0 0-.101-.024.407.407 0 0 0-.202.048c-.06.028-.092.08-.127.136-.087.128-.15.268-.226.4-.107.187-.246.351-.38.515-.135.156-.286.291-.424.44-.028.027-.072.043-.107.027-.028-.016-.036-.056-.032-.088.04-.38.075-.763.123-1.138.02-.172.043-.336.063-.512.028-.247.056-.487.087-.735l.234-1.824c.02-.128.032-.372-.135-.52a.446.446 0 0 0-.233-.116.46.46 0 0 0-.254.06c-.226.16-.297.504-.365.76-.142.603-.178 1.241-.471 1.804a1.772 1.772 0 0 1-.202.316.668.668 0 0 1-.186.18.332.332 0 0 1-.246.051.365.365 0 0 1-.238-.207.871.87 0 0 1-.063-.324 4.499 4.499 0 0 1 .24-1.585c.045-.132.089-.252.104-.383.028-.156.028-.38-.114-.516-.131-.128-.337-.18-.504-.128-.194.056-.31.244-.372.392-.198.463-.25.95-.317 1.446-.044.327-.127.64-.293.926a2.717 2.717 0 0 1-.603.72c-.118.087-.222.123-.328.107a.376.376 0 0 1-.278-.208.875.875 0 0 1-.095-.315 3.361 3.36 0 0 1-.036-.616c.004-.223 0-.44.044-.658.075-.39.678-1.937.808-2.345.135-.407.262-.823.353-1.246.08-.38.123-.767.11-1.15-.007-.277-.07-.576-.288-.736a.611.61 0 0 0-.603-.048.968.968 0 0 0-.455.428 2.53 2.53 0 0 0-.226.59 12.01 12.01 0 0 0-.266 1.29c-.071.429-.138.848-.206 1.268-.06.355-.206 1.614-.261 1.88-.06.272-.175.54-.301.787-.131.268-.258.536-.408.791a.694.694 0 0 1-.175.224c-.08.06-.182.088-.27.048-.102-.048-.146-.176-.166-.292-.075-.435-.012-.875.072-1.302.083-.431.44-2.4.519-2.851.099-.532.24-1.05.285-1.59.028-.388.09-.88-.202-1.187-.115-.136-.31-.16-.44-.136-.174.036-.31.176-.388.296-.1.128-.186.28-.258.467-.115.284-.186.615-.261.91l-.032.129c-.083.383-.143.77-.186 1.162a16.95 16.948 0 0 0-.06.632c-.008.1-.016.203-.027.307 0 .08.007.168-.028.244a.304.304 0 0 1-.052.068c-.08.072-.202.06-.31.056-.557-.016-1.045.3-1.35.755-.18.252-.281.542-.39.834-.01.048-.034.1-.054.152-.051.143-.13.327-.222.511a3.037 3.037 0 0 1-.317.46 3.285 3.285 0 0 1-.384.41 1.123 1.123 0 0 1-.515.26c-.174.04-.384-.043-.543-.203a.916.916 0 0 1-.206-.54c-.004-.055-.004-.115.028-.163.05-.068.146-.072.23-.076a1.623 1.623 0 0 0 1.375-1.015c.138-.34.178-.698.122-1.046a1.193 1.193 0 0 0-.19-.48.9.9 0 0 0-.396-.323c-.293-.14-.658-.127-1.01.004-.575.232-.951.74-1.134 1.562l-.02.088c-.114.487-.23 1-.582 1.354-.127.12-.261.163-.368.143-.044-.004-.08-.04-.103-.075-.096-.16.003-.532.15-1a4.1 4.1 0 0 0 .1-.366.925.925 0 0 0-.108-.495.783.783 0 0 0-.372-.324c-.143-.064-.31-.06-.468-.06h-.047c-.044 0-.103 0-.151-.012a.215.215 0 0 1-.147-.127.485.485 0 0 1 .016-.232c.004-.02.012-.048.016-.072a.368.368 0 0 0-.162-.412.509.509 0 0 0-.468-.036.768.768 0 0 0-.364.348.769.769 0 0 0-.103.48c.04.13.07.32.043.475-.055.28-.222.51-.384.74-.04.05-.072.106-.107.16a4.96 4.96 0 0 1-.706.825c-.372.335-.804.575-1.232.67-.745.165-1.506-.06-1.91-.734-.222-.38-.32-.827-.348-1.266a5.425 5.425 0 0 1 .424-2.516c.328-.76.816-1.52 1.715-1.614.353-.04.753.083.912.4.115.23.075.506 0 .75-.072.244-.175.49-.18.75-.003.26.124.54.37.616.238.072.495-.08.634-.29.138-.21.186-.46.245-.704a6.282 6.281 0 0 1 .662-1.634c.139-.236.297-.488.254-.76a.543.543 0 0 0-.373-.415.543.543 0 0 0-.535.144c-.134.148-.206.371-.387.43-.17.06-.35-.055-.507-.134-.6-.32-1.336-.312-1.963-.048-.634.25-1.146.735-1.526 1.294C.462 8.53.098 9.508.022 10.48c-.027.34-.031.695 0 1.038.036.46.1.854.214 1.206.139.423.317.79.547 1.094.266.34.587.6.94.747.372.148.784.22 1.192.208a3.172 3.172 0 0 0 1.177-.283 4.29 4.29 0 0 0 1.026-.68c.309-.26.594-.559.84-.89.162-.224.309-.46.44-.708a4.83 4.83 0 0 0 .178-.383c.044-.104.087-.215.202-.26.056-.043.15-.02.202.013.064.04.115.075.135.135.048.116.02.232-.004.332v.012c-.028.1-.055.203-.091.303-.14.424-.238.811-.16 1.195.045.207.128.387.25.527a.84.84 0 0 0 .504.264c.246.04.51-.028.725-.132.143-.068.278-.156.397-.26.06-.06.122-.12.174-.184.044-.06.087-.147.178-.143a.15.15 0 0 1 .107.064c.028.031.04.071.06.115.23.52.776.84 1.335.84h.07c.27 0 .556-.093.79-.22.27-.14.48-.348.7-.552.02-.016.045-.04.073-.044.035-.008.07.012.099.044a.26.26 0 0 1 .047.1c.135.34.46.6.824.66a1.1 1.1 0 0 0 .99-.356c.056-.06.104-.128.167-.176.064-.044.15-.076.222-.044.107.04.135.164.182.268.107.235.357.371.615.375.289 0 .554-.148.764-.34.195-.183.353-.399.516-.61a.328.328 0 0 1 .106-.096c.04-.024.096-.028.13 0 .033.024.045.06.06.091.163.4.587.652 1.01.648.417-.004.809-.224 1.103-.516.095-.092.194-.2.32-.21.14-.017.207.114.254.22.072.142.115.238.25.338.158.116.36.152.547.1.17-.04.34-.156.47-.316.072-.088.112-.204.19-.284.092-.087.132.028.136.1.016.116.016.236.008.352-.016.236-.052.471-.08.703-.011.068-.02.136-.063.188-.06.068-.166.08-.253.064a2.898 2.898 0 0 0-.321-.028l-.14-.016c-.201-.012-.4-.036-.61-.044h-.185c-.404 0-.733.048-1.03.16-.48.187-.852.57-1.003 1.018a1.305 1.305 0 0 0-.052.64c.04.203.13.403.282.587.265.315.68.515 1.149.543.408.02.852-.064 1.292-.26.848-.367 1.482-1.094 1.696-1.95 0-.02.01-.039.023-.043.298-.104.57-.248.813-.428.245-.187.467-.399.65-.643.09-.12.174-.243.253-.37.07-.125.13-.257.202-.38a.906.906 0 0 0 .13-.316.411.411 0 0 0-.05-.328.257.257 0 0 0-.135-.124m-13.68-1.63c.017-.071.045-.14.06-.206a1.9 1.9 0 0 1 .262-.504c.04-.048.08-.1.135-.136a.246.246 0 0 1 .186-.048c.107.02.183.128.202.236.032.18-.04.396-.114.555a1.097 1.097 0 0 1-.31.415c-.06.044-.114.088-.178.116-.028.008-.063.028-.115.028h-.016c-.055 0-.114-.028-.126-.088a.827.827 0 0 1 .015-.367m4.308-.184c-.004.072-.024.148-.028.223a4.91 4.91 0 0 0 0 .779c.012.152.047.3-.016.444a1.069 1.069 0 0 1-.567.643.555.555 0 0 1-.245.056c-.02 0-.04-.004-.06-.004-.12 0-.214-.092-.265-.18a.871.87 0 0 1-.1-.272 2.129 2.129 0 0 1 .072-1.122c.08-.22.202-.435.38-.594a.874.874 0 0 1 .563-.24.31.31 0 0 1 .206.064c.04.044.06.104.056.164a.05.05 0 0 1 .004.04m6.43 4.653c-.015.044-.06.104-.08.14-.042.08-.102.163-.161.235a2.562 2.562 0 0 1-.317.304c-.238.18-.503.311-.777.387a2.025 2.025 0 0 1-.487.072h-.04a.795.795 0 0 1-.515-.18.433.433 0 0 1-.158-.25.537.537 0 0 1 .047-.305.776.776 0 0 1 .38-.383c.326-.16.682-.176 1.019-.16.139.004.265.012.4.02.107.004.218.012.325.024.056 0 .115.004.17.012.044.004.092-.004.135.008.06.004.068.036.06.076" />
  </svg>
);

const DevpostIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853Z" />
  </svg>
);

const UnstopIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.394 0 0 5.394 0 12s5.394 12 12 12 12-5.394 12-12S18.606 0 12 0Zm-1.2 16.86H8.303v-1.127c-.715 1.091-1.588 1.552-2.897 1.552-2.085 0-3.248-1.2-3.248-3.333V7.248h2.509v6.182c0 1.164.533 1.722 1.6 1.722 1.224 0 2.012-.752 2.012-1.891V7.236h2.509v9.625zm8.533 0v-5.939c0-1.14-.533-1.721-1.6-1.721-1.224 0-2.012.752-2.012 1.89v5.77h-2.509V7.237h2.497V8.63c.715-1.09 1.588-1.551 2.897-1.551 2.085 0 3.249 1.2 3.249 3.333v6.449z" />
  </svg>
);

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M0 0h11.408v11.408H0zm12.592 0H24v11.408H12.592zM0 12.592h11.408V24H0zm12.592 0H24V24H12.592z" />
  </svg>
);
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase.from('profile_settings').select('*').single();

  // 2. Fetch Skills & Categories
  const { data: categories } = await supabase.from('skill_categories').select('*').order('sort_order', { ascending: true });
  const { data: skillsDataRaw } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });

  const skillsData = (categories || []).map(cat => {
    const catSkills = skillsDataRaw?.filter(s => s.category_id === cat.id).map(s => s.name) || [];
    return { name: cat.name, skills: catSkills };
  }).filter(cat => cat.skills.length > 0);

  // 3. Fetch Projects
  const { data: projectsData } = await supabase.from('projects').select('*').eq('status', 'published').order('sort_order', { ascending: true });
  const { data: projectTech } = await supabase.from('project_technologies').select('*');

  const projects = (projectsData || []).map(p => {
    const techIds = projectTech?.filter(t => t.project_id === p.id).map(t => t.skill_id) || [];
    const stack = techIds.map(id => skillsDataRaw?.find(s => s.id === id)?.name).filter(Boolean);
    return {
      id: p.slug,
      title: p.title,
      description: p.short_description || '',
      stack: stack,
      github: p.github_url || '',
      demo: p.live_url || '',
      images: p.thumbnail_url ? [p.thumbnail_url] : [],
      metrics: [],
      category: 'Full Stack' as const
    };
  });

  // 4. Fetch Achievements
  const { data: achievementsData } = await supabase.from('achievements').select('*').order('issue_date', { ascending: false });
  const achievements = (achievementsData || []).map(a => ({
    id: a.id,
    title: a.title,
    issuer: a.issuer,
    date: a.issue_date ? new Date(a.issue_date).getFullYear().toString() : 'Present',
    description: a.description || '',
    type: (a.type === 'milestone' ? 'Open Source' : a.type === 'hackathon' ? 'Hackathon' : 'Recognition') as any,
    image: a.image_url || '',
    url: a.credential_url || ''
  }));

  // Fallbacks if profile isn't populated
  const heroTitle = profile?.hero_title || "AI Systems Engineer & Full Stack Developer";
  const heroBio = profile?.bio || "Building intelligent systems, scalable architectures, and next-generation robotics.";
  const fullName = profile?.full_name || "YASH MARATHE";

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)]"></div>

      {/* Hero Section */}
      <section id="home" className="relative w-full min-h-screen flex flex-col justify-center items-start px-4 sm:px-8 md:px-24 border-b border-border-glass overflow-hidden pt-24 pb-12">
        <HeroScene />
        <div className="z-10 flex flex-col md:flex-row items-center md:items-start justify-between w-full max-w-7xl gap-12 md:gap-8">
          {/* Left Content */}
          <div className="flex flex-col max-w-4xl md:max-w-2xl lg:max-w-3xl flex-1 text-center md:text-left items-center md:items-start">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-2 w-2 bg-primary-container rounded-full animate-pulse shrink-0"></span>
              <span className="text-technical-label text-primary uppercase text-[10px] sm:text-xs">System Online // Identity Confirmed</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl text-foreground mb-4 sm:mb-6 uppercase leading-tight w-full">
              <GlitchText speed={1} enableShadows={true} enableOnHover={true}>
                {fullName}
              </GlitchText>
            </h1>
            <div className="text-xl sm:text-2xl md:text-2xl lg:text-4xl text-on-surface-variant font-sans tracking-wide">
              <TrueFocus
                sentence={heroTitle}
                separator=" & "
                manualMode={true}
                blurAmount={4}
                animationDuration={0.3}
              />
            </div>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl font-sans leading-relaxed">
              {heroBio}
            </p>
            <div className="mt-12 flex flex-col md:flex-row gap-6 font-mono text-technical-code w-full sm:w-auto">
              <Link
                href="#projects"
                className="magnetic group flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 uppercase hover:bg-primary transition-colors w-full md:w-auto text-center"
              >
                View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {profile?.resume_file_url ? (
                <a
                  href={profile.resume_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="magnetic flex items-center justify-center gap-2 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center"
                >
                  <Terminal className="w-4 h-4" /> Download Resume
                </a>
              ) : (
                <Link
                  href="#contact"
                  className="magnetic flex items-center justify-center gap-2 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center"
                >
                  <Terminal className="w-4 h-4" /> Initialize Contact
                </Link>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2 -ml-2" aria-label="GitHub">
                  <GithubIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="LinkedIn">
                  <LinkedinIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Twitter">
                  <TwitterIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              )}
              <a href="https://leetcode.com/u/yash_still_exists/" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="LeetCode">
                <LeetCodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://www.kaggle.com/yashrameshmarathe" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Kaggle">
                <KaggleIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </a>
              <a href="https://discord.com/users/1090971198738931744" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Discord">
                <DiscordIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://gssoc.girlscript.org/profile/6991c419-a093-44d4-a60f-4f1973437599" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2 flex items-center" aria-label="GSSoC">
                <span className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase">GSSOC</span>
              </a>
              <a href="https://unstop.com/u/yashmar82114" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Unstop">
                <UnstopIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://www.credly.com/users/yash-marathe.5e44828f" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Credly">
                <CredlyIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </a>
              <a href="https://hack2skill.com/dashboard/user_public_profile/?userId=698764761fc7dba7ab7d76d9&utm_source=hack2skill&utm_medium=homepage" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2 flex items-center" aria-label="Hack2Skill">
                <span className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase">HACK2SKILL</span>
              </a>
              <a href="https://devpost.com/yashmarathe4141?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Devpost">
                <DevpostIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://learn.microsoft.com/en-us/users/YashMarathe-0997" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Microsoft Learn">
                <MicrosoftIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </div>
          </div>

          {/* Right Profile Image - Digital Wanted Poster */}
          <div className="group relative w-64 h-80 sm:w-72 sm:h-96 md:w-72 md:h-[22rem] lg:w-[320px] lg:h-[460px] flex-shrink-0 mt-16 md:mt-0 order-last md:ml-auto p-3 lg:p-4 border-2 border-border-glass group-hover:border-primary/50 transition-colors duration-700 bg-surface-elevated/40 rounded-sm flex flex-col items-center shadow-2xl overflow-hidden">

            {/* Glowing Backdrop */}
            <div className="absolute inset-0 -z-10 bg-primary/5 rounded-none blur-2xl group-hover:bg-primary/20 transition-all duration-700 opacity-0 group-hover:opacity-100" />

            {/* Wanted Header */}
            <div className="text-center mb-2 lg:mb-3 w-full shrink-0">
              <h3 className="font-serif text-4xl lg:text-5xl font-black tracking-[0.15em] text-on-surface-variant group-hover:text-primary transition-colors duration-700">WANTED</h3>
              <p className="font-mono text-[8px] lg:text-[10px] font-bold tracking-[0.3em] text-on-surface-variant/70 mt-1">DEAD OR ALIVE</p>
            </div>

            {/* Image Container */}
            <div className="relative w-full flex-1 border-2 border-border-glass group-hover:border-primary/50 transition-colors duration-700 overflow-hidden bg-surface">
              {/* Subtle Tech Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] z-30 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />

              {/* Default State: Luffy Wanted Poster */}
              <Image
                src="/luffy_OP_image.png"
                alt="Luffy Wanted"
                fill
                className="object-cover object-top scale-[1.1] opacity-80 grayscale-[30%] sepia-[50%] group-hover:opacity-0 transition-opacity duration-700 ease-out z-20"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                priority
              />

              {/* Hover State: True Identity (Yash in B&W) */}
              <Image
                src="/yash.png"
                alt="Yash Marathe"
                fill
                className="object-cover object-top opacity-0 grayscale contrast-125 scale-95 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out z-10"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                priority
              />
            </div>

            {/* Bounty Footer */}
            <div className="text-center mt-3 lg:mt-4 w-full shrink-0">
              <h4 className="font-serif text-lg lg:text-2xl font-bold tracking-[0.2em] text-on-surface-variant group-hover:text-on-surface transition-colors duration-700 uppercase">
                YASH MARATHE
              </h4>
              <p className="font-serif text-lg lg:text-2xl font-black tracking-widest text-on-surface-variant group-hover:text-primary transition-colors duration-700 mt-1">
                ฿ 3,000,000,000-
              </p>
            </div>

            {/* Tech Rivets */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full border border-on-surface-variant/40" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full border border-on-surface-variant/40" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full border border-on-surface-variant/40" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full border border-on-surface-variant/40" />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 border-b border-border-glass bg-surface">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            <span className="text-primary-container font-mono text-lg sm:text-xl shrink-0">[01]</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl uppercase break-words hyphens-auto">Intelligent Solutions</h2>
          </div>

          <ProjectGridClient cards={projects.map((project) => <ProjectCard key={project.id} project={project as any} />)} />
        </Reveal>
      </section>

      {/* Skills & Architecture Section */}
      <section id="skills" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 border-b border-border-glass bg-surface-dim">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            <span className="text-primary-container font-mono text-lg sm:text-xl shrink-0">[02]</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl uppercase break-words hyphens-auto">Technical Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillsData.map((category) => (
              <div key={category.name} className="flex flex-col gap-6">
                <h3 className="text-xl font-mono text-primary border-b border-border-glass pb-4 uppercase">
                  // {category.name}
                </h3>
                <ul className="flex flex-col gap-4">
                  {category.skills.map(skill => (
                    <li key={skill} className="text-body-md text-on-surface font-sans flex items-center gap-3">
                      <span className="h-px w-4 bg-outline-variant"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 bg-surface">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            <span className="text-primary-container font-mono text-lg sm:text-xl shrink-0">[03]</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl uppercase break-words hyphens-auto">Operational Milestones</h2>
          </div>

          <div className="flex flex-col gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border border-border-glass hover:bg-surface-elevated transition-colors gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-heading uppercase text-foreground">{item.title}</h3>
                  <span className="text-technical-label text-primary">{item.issuer}</span>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <span className="text-technical-code text-on-surface-variant">{item.date}</span>
                  <span className="text-technical-label bg-surface-container px-3 py-1 border border-border-glass">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 bg-surface-dim border-b border-border-glass">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto items-center">
          <ContactForm />
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 md:px-24 border-t border-border-glass bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-technical-code text-on-surface-variant">
          © {new Date().getFullYear()} {fullName}. All rights reserved.
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 text-technical-label">
          <div className="flex gap-4">
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="hidden md:block w-px h-6 bg-border-glass"></div>
          <p className="text-primary-container">Press Ctrl + K for Command Palette</p>
        </div>
      </footer>
    </main>
  );
}
