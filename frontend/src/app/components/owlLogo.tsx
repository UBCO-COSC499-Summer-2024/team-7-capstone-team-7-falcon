import React from "react";

export interface LogoProps {
  width?: string;
  height?: string;
  className?: string;
  background?: boolean;
}

/**
 * Represents the OwlLogo SVG component.
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.width="50%"] - The width of the logo.
 * @param {string} [props.height="50%"] - The height of the logo.
 * @param {string} [props.className=""] - The additional CSS class name for the logo.
 * @param {boolean} [props.background=false] - Whether to show a background behind the logo.
 * @returns {JSX.Element} The rendered OwlLogo component.
 */
const OwlLogo: React.FC<LogoProps> = ({
  width = "50%",
  height = "50%",
  className = "",
  background = false,
}) => {
  return (
    <svg
      className={className}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="200 100 700 900"
      enable-background="new 0 0 1024 1024"
    >
      {background && (
        <rect width="100%" height="100%" rx="180" fill="#fef7e8" />
      )}
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M666.303833,202.544952 
	C670.902527,203.689667 675.111389,204.684616 679.271667,205.852509 
	C717.830444,216.676666 753.222717,210.033188 785.608398,186.664719 
	C786.396362,186.096146 787.291504,185.676132 788.272644,185.108047 
	C788.855408,185.656723 789.509216,186.002426 789.745850,186.533890 
	C800.692932,211.124786 795.693726,241.541031 768.943420,257.702209 
	C764.296204,260.509857 760.751953,260.705322 756.579041,256.719696 
	C751.654968,252.016617 745.967712,248.122955 740.791565,243.668854 
	C738.241089,241.474167 735.689514,241.028412 732.500549,241.774918 
	C707.653625,247.591354 688.634949,261.955139 673.357849,281.861755 
	C671.533020,284.239594 669.738647,286.640869 667.895142,289.003967 
	C667.728271,289.217804 667.303345,289.230225 666.288269,289.582855 
	C662.178589,282.409149 657.425476,275.457855 651.314270,269.551544 
	C628.300293,247.309311 600.931396,236.001617 568.877747,238.508774 
	C530.386047,241.519501 499.109558,273.508270 494.066650,311.542816 
	C488.895477,350.544647 511.750031,387.267242 548.008850,402.587494 
	C551.516541,404.069611 554.232422,406.131714 556.750244,408.913116 
	C578.136414,432.537750 590.068420,460.510925 594.318359,491.785431 
	C601.346680,543.505127 585.980896,588.031677 550.195557,625.741943 
	C523.770874,653.588013 490.970062,669.224182 453.674530,676.435547 
	C439.063599,679.260620 424.374268,680.376587 409.514496,680.335693 
	C361.518768,680.203613 313.522522,680.255249 265.526489,680.221924 
	C258.429626,680.217041 258.314911,679.953491 259.258392,672.744934 
	C260.293671,664.835083 261.369385,656.919434 262.007141,648.972595 
	C262.414185,643.900818 264.620819,642.508362 269.604279,642.558960 
	C294.433044,642.810730 319.265747,642.678284 344.097046,642.677185 
	C369.928284,642.675964 395.779633,643.323425 421.586456,642.527649 
	C472.119873,640.969482 512.852600,620.569519 539.615234,576.644409 
	C573.620361,520.832458 558.514526,450.433685 506.127838,415.054108 
	C489.703827,403.962067 471.436768,397.820404 451.543610,396.089752 
	C440.216034,395.104340 429.037628,396.596130 417.573456,396.719208 
	C417.664825,393.224457 420.427002,392.192993 422.411652,390.687622 
	C434.294586,381.674316 447.524597,374.951569 460.923340,368.594482 
	C465.218048,366.556915 465.992249,364.312866 464.913666,359.644958 
	C458.788544,333.136078 462.304688,307.426208 472.563049,282.496887 
	C474.904022,276.808075 477.710022,271.296783 480.547516,265.831268 
	C482.237885,262.575226 481.482788,261.025238 478.006012,260.111023 
	C469.435760,257.857574 461.217987,254.830109 453.878052,249.604279 
	C431.907532,233.961823 425.771027,207.808670 435.237579,182.867203 
	C435.338165,182.602051 435.724030,182.445175 436.082275,182.151123 
	C438.464417,182.058304 439.763153,184.018219 441.399536,185.300293 
	C460.490784,200.258163 482.455231,207.546143 506.349274,209.712006 
	C509.827301,210.027252 513.309082,210.305832 516.782715,210.663620 
	C531.848145,212.215408 546.008057,208.399338 560.333618,204.280396 
	C584.022034,197.469391 608.396362,195.213074 632.988098,196.867981 
	C644.084717,197.614746 655.100403,199.567123 666.303833,202.544952 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M683.410034,672.443604 
	C647.000305,701.154114 605.989136,718.364929 560.594604,725.069275 
	C526.527161,730.100769 492.928345,726.508057 459.635101,718.527405 
	C455.164215,717.455627 453.361664,715.600647 453.557007,710.762817 
	C454.123383,696.735474 451.681671,700.086304 464.380798,697.107117 
	C498.421173,689.121277 529.000793,674.414917 555.340942,651.280334 
	C558.348694,648.638550 560.456543,648.607483 563.999695,650.673035 
	C594.341553,668.361450 629.301453,670.981262 657.499451,648.428284 
	C662.144226,644.713379 666.215088,640.505432 669.576721,634.678955 
	C637.136047,645.780884 606.018250,645.961182 575.797485,631.568420 
	C575.187866,629.401123 576.197937,628.663391 576.987793,627.846069 
	C584.942993,619.614258 591.242737,610.210876 595.916626,599.819153 
	C597.796082,595.640503 599.681213,595.200745 603.865234,596.725159 
	C632.045715,606.991699 660.717102,609.035278 689.442139,599.478760 
	C707.126404,593.595337 718.718689,581.472839 722.208496,562.580933 
	C722.449097,561.278381 722.610168,559.948792 722.657043,558.626404 
	C722.697083,557.498291 722.519531,556.362427 722.449524,555.386597 
	C721.247864,554.679199 720.603394,555.277100 720.085144,555.915100 
	C708.253723,570.477783 692.071899,577.227295 674.278503,579.976074 
	C653.658447,583.161499 633.147766,581.964233 613.172058,575.062134 
	C609.524048,573.801697 608.474365,572.491211 609.923584,568.669617 
	C613.532532,559.152710 615.683838,549.240173 616.792908,539.109680 
	C616.989990,537.309570 617.226929,535.487366 618.511414,533.595154 
	C625.223328,534.785095 632.008240,536.284607 638.873108,537.152161 
	C664.580750,540.400940 689.743835,538.992920 713.402649,527.112488 
	C731.828064,517.860107 740.694336,500.713104 737.111511,481.183350 
	C728.039917,493.308350 716.301208,501.466492 702.694824,506.968811 
	C682.773132,515.024902 662.151123,516.798279 640.952942,513.720581 
	C634.844849,512.833801 628.865417,511.486938 622.868103,510.146881 
	C620.458191,509.608429 618.669983,508.657532 618.646790,505.565430 
	C618.504944,486.669067 613.793701,468.731384 606.956909,451.259949 
	C606.737427,450.699066 606.783936,450.034088 606.659119,449.041473 
	C609.509827,449.229645 611.030151,451.123474 612.792175,452.420563 
	C642.663330,474.410126 683.615662,472.737732 710.404541,448.201416 
	C720.398499,439.047760 727.099731,427.906738 728.610107,414.165039 
	C728.876892,411.738312 729.879456,410.544312 732.061096,410.015198 
	C738.219299,408.521606 744.259460,406.640289 750.116699,404.227753 
	C753.034851,403.025787 754.654419,403.653107 755.782776,406.766235 
	C761.985535,423.879547 766.323059,441.408264 768.381714,459.516296 
	C769.548279,469.776520 770.453613,480.024963 770.328003,490.369080 
	C769.614258,549.130554 750.255981,600.849670 711.833496,645.350159 
	C703.328247,655.200745 694.025696,664.266235 683.410034,672.443604 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M401.012848,551.037231 
	C410.839081,556.342224 407.715790,565.238220 406.707092,572.547180 
	C403.912323,592.798279 391.538544,607.169006 375.713440,619.008118 
	C374.120819,620.199585 372.347595,620.298645 370.499329,620.298218 
	C338.347382,620.290894 306.195221,620.226868 274.043793,620.351624 
	C269.322083,620.369995 268.445740,618.883972 269.517914,614.405090 
	C276.164886,586.638550 284.881256,559.633179 297.783569,534.069519 
	C299.331604,531.002441 301.238495,529.676147 304.740875,529.689941 
	C330.395325,529.790771 356.050659,529.771912 381.705109,529.659302 
	C385.129944,529.644287 387.192505,530.529785 388.485962,533.994629 
	C390.978882,540.672424 395.540253,546.009033 401.012848,551.037231 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M533.236511,486.059296 
	C547.533752,541.757385 513.649109,599.100769 457.448914,615.280151 
	C440.375366,620.195435 423.011871,620.687256 405.496094,620.222961 
	C404.895325,620.207031 404.302368,619.894653 403.774170,619.740479 
	C403.406281,617.824036 404.795044,617.150696 405.699646,616.315918 
	C417.974792,604.988464 425.736267,591.121826 428.965027,574.764893 
	C429.763641,570.719055 431.315643,569.919922 435.698975,570.288940 
	C469.765015,573.156250 498.380341,549.261414 503.637604,518.948303 
	C509.450134,485.433594 486.710724,454.326599 452.455139,447.654327 
	C446.092010,446.414917 439.497955,446.628448 433.008759,447.107788 
	C429.327393,447.379669 427.801300,446.000397 427.873016,442.314636 
	C427.996216,435.984558 428.128815,429.640533 427.841461,423.321259 
	C427.629700,418.664703 429.772125,417.331268 434.015808,417.043365 
	C479.643524,413.947906 516.250244,437.884247 531.517578,480.936035 
	C532.074036,482.505310 532.611572,484.081360 533.236511,486.059296 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M524.471680,356.442505 
	C507.052124,328.346283 515.118347,291.715515 536.881714,273.355225 
	C560.111572,253.757767 594.698059,256.257233 612.991699,268.074921 
	C596.447754,268.252808 583.034485,274.441559 572.715027,286.488647 
	C565.677368,294.704468 561.063049,304.284912 560.309631,315.360779 
	C559.624268,325.436249 561.714539,334.821045 566.851440,343.594818 
	C571.875000,352.175079 578.833313,358.616943 587.376465,363.539978 
	C596.080933,368.555969 605.639099,370.025604 615.732605,370.646606 
	C607.792480,379.981354 597.203369,383.782043 585.825562,385.135345 
	C559.759521,388.235657 539.276062,378.661591 524.471680,356.442505 
z"
      />
      <path
        fill="#991c92"
        opacity="1.000000"
        stroke="none"
        d="
M428.808868,469.505371 
	C454.723938,460.312531 482.898621,477.579620 485.087067,507.980103 
	C486.567902,528.551392 468.442230,548.829956 447.309692,550.270325 
	C422.284119,551.975891 403.812134,536.665527 400.828918,511.744904 
	C398.800751,494.802002 410.391907,477.120850 428.808868,469.505371 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M359.406982,809.283508 
	C351.909119,819.965759 342.095520,826.672363 329.802185,829.765015 
	C324.261139,831.158997 322.701508,830.067200 322.705627,824.461304 
	C322.726166,796.473755 322.509583,768.480896 323.013611,740.501343 
	C323.205383,729.857117 323.733734,719.205261 323.610626,708.552368 
	C323.568359,704.896423 324.864288,703.549133 328.548340,703.603149 
	C340.041016,703.771729 351.537872,703.752625 363.031952,703.659668 
	C366.257050,703.633606 367.409241,704.871277 367.397339,708.080078 
	C367.300812,734.068298 367.444061,760.058105 367.222382,786.044922 
	C367.151337,794.370239 364.088928,801.980286 359.406982,809.283508 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M771.242554,324.126221 
	C770.694153,347.694794 762.272095,366.693970 742.285767,379.490692 
	C732.979553,385.449219 723.076538,386.330719 712.682190,382.312286 
	C709.941345,381.252686 708.904053,380.056854 710.085510,377.168915 
	C710.833069,375.341309 711.763916,373.232056 711.502747,371.408020 
	C710.117737,361.734955 714.884399,355.854401 721.540527,349.189880 
	C742.384338,328.319733 731.639465,293.558258 702.984619,286.824738 
	C701.709534,286.525085 700.437866,286.210693 698.937805,285.848389 
	C699.143066,282.925079 701.312927,281.361389 702.962219,279.771210 
	C708.516052,274.416077 714.975037,270.293884 721.942993,266.994385 
	C724.093201,265.976166 726.251343,265.833282 728.703979,266.414612 
	C747.887451,270.961700 758.787842,284.402771 766.396973,301.334473 
	C769.569519,308.393951 770.558533,316.011963 771.242554,324.126221 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M720.318848,757.009827 
	C719.789246,777.627808 705.000122,791.518799 684.283630,791.316528 
	C666.370056,791.141663 651.710083,775.644897 651.798828,756.977539 
	C651.888428,738.127441 666.592712,722.968628 685.040588,722.708435 
	C704.535217,722.433472 719.653625,736.937317 720.318848,757.009827 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M381.069641,337.375366 
	C363.026123,336.871643 348.588257,321.795197 348.746185,304.108337 
	C348.908600,285.914520 363.403229,272.044067 381.670898,271.509033 
	C399.484436,270.987274 412.655212,283.720886 415.133606,299.056671 
	C417.990875,316.736542 407.833862,331.737701 390.449524,336.603241 
	C387.481201,337.434021 384.520905,337.276093 381.069641,337.375366 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M388.936890,750.000000 
	C388.902771,736.023804 388.982849,722.545837 388.767456,709.072571 
	C388.701447,704.941650 390.144012,703.536499 394.260040,703.614502 
	C405.236542,703.822632 416.220398,703.751648 427.199677,703.634216 
	C430.476471,703.599243 432.214813,704.597046 432.130402,708.136780 
	C431.769928,723.256592 432.915009,738.392090 431.385681,753.505066 
	C429.453308,772.601440 412.622498,790.555969 393.680298,793.740417 
	C389.316437,794.474060 388.852936,792.082764 388.854645,788.931824 
	C388.861603,776.121216 388.906525,763.310608 388.936890,750.000000 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M343.562958,377.780487 
	C349.155518,399.272552 338.363098,417.008331 317.797211,420.734406 
	C302.349030,423.533264 287.033081,413.781830 282.400208,398.197754 
	C275.829651,376.095734 292.133240,354.479034 314.963928,355.844360 
	C328.796051,356.671539 338.478027,364.215424 343.562958,377.780487 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M279.887695,862.982056 
	C274.779572,866.621521 269.416168,868.800415 263.683746,870.087830 
	C259.786285,870.963074 257.695801,869.727722 257.714325,865.322266 
	C257.803680,844.026184 257.770538,822.729553 257.746918,801.433105 
	C257.744354,799.105835 258.129730,797.269104 260.679352,796.310730 
	C273.398193,791.530090 285.169403,785.130371 295.167816,775.759521 
	C295.875916,775.095886 296.764435,774.522461 298.400391,775.033020 
	C299.737244,778.423462 300.289124,782.275208 300.308197,786.208801 
	C300.367096,798.354065 300.212799,810.502380 300.425385,822.644470 
	C300.722931,839.637329 293.658112,852.788452 279.887695,862.982056 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M673.077881,295.984833 
	C675.366760,295.965790 675.920410,297.723938 676.804993,299.060547 
	C699.039368,332.655823 696.182800,380.090546 670.089844,410.681580 
	C668.922485,412.050140 667.786011,413.506104 666.183777,414.006958 
	C664.370911,413.531158 664.353394,412.262421 664.330994,411.135956 
	C663.958069,392.412109 656.143127,376.790436 644.201233,362.913605 
	C642.720398,361.192780 641.826660,359.876740 643.899536,357.905640 
	C658.859009,343.680542 665.983276,325.402435 670.617554,305.862427 
	C671.380493,302.645447 672.074036,299.411957 673.077881,295.984833 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M355.753082,456.310364 
	C364.226410,465.726776 373.037598,474.324036 382.110809,482.644135 
	C384.743622,485.058411 385.614563,487.283875 384.538269,490.922394 
	C383.039581,495.988708 382.029694,501.277557 381.541412,506.538971 
	C381.180603,510.426880 379.324066,511.165161 376.053345,511.161438 
	C361.246307,511.144562 346.439148,511.231720 331.632050,511.268555 
	C325.012970,511.285034 318.393829,511.271362 311.635956,511.271362 
	C311.346680,507.181458 313.570892,504.711365 315.131287,502.132629 
	C325.153992,485.568665 336.823303,470.252197 350.286438,456.310974 
	C352.105621,454.427246 353.645630,453.576263 355.753082,456.310364 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M611.907471,290.667694 
	C627.172791,291.335968 639.078918,303.832458 638.837036,318.449310 
	C638.574890,334.297729 625.732422,347.384064 610.743896,347.076050 
	C595.683899,346.766602 582.822632,334.094360 582.683228,319.427826 
	C582.519104,302.161743 593.932007,290.750092 611.907471,290.667694 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M288.989716,703.653809 
	C293.924561,703.653870 298.361755,703.653870 303.035126,703.653870 
	C304.128113,714.586243 302.989319,724.479614 298.439392,733.822327 
	C290.931335,749.239136 279.435333,760.491760 263.382385,766.843445 
	C258.662201,768.711121 257.830872,768.137573 257.816589,763.037354 
	C257.766205,745.081787 257.908813,727.124390 257.685760,709.171387 
	C257.629333,704.627319 259.362152,703.493042 263.555756,703.615051 
	C271.861237,703.856628 280.179230,703.665771 288.989716,703.653809 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M281.153015,482.052979 
	C271.488770,492.842804 257.592896,494.433868 247.634674,486.156586 
	C237.269135,477.540741 235.641113,462.783569 243.887878,452.193848 
	C251.828735,441.996979 266.233948,440.113220 276.912415,447.659088 
	C287.174469,454.910797 290.005005,471.062775 281.153015,482.052979 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M584.252686,760.797485 
	C599.284790,759.430542 608.847656,765.242310 612.481323,777.647156 
	C616.011047,789.697021 609.134949,802.979797 597.275818,807.020142 
	C585.750183,810.946777 572.726501,805.287598 568.064148,794.326660 
	C562.968750,782.347717 567.959961,768.112854 579.202759,762.672546 
	C580.693665,761.951050 582.293701,761.455139 584.252686,760.797485 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M518.087769,807.559326 
	C504.662659,810.128662 492.397980,802.200012 489.810364,789.646362 
	C487.182526,776.897644 495.154602,763.535522 506.976654,760.873596 
	C520.141052,757.909424 531.857117,765.140259 535.540894,778.502930 
	C538.997375,791.041138 531.651428,803.519348 518.087769,807.559326 
z"
      />
      <path
        fill="#7c22cd"
        opacity="1.000000"
        stroke="none"
        d="
M377.987549,454.013489 
	C374.259613,450.409515 370.797485,447.039307 367.301575,443.704529 
	C365.641602,442.121094 364.743317,440.662506 367.070160,438.818298 
	C378.495941,429.762573 390.944458,422.424164 404.253937,416.520416 
	C404.822601,416.268158 405.517609,416.300568 406.105988,416.207886 
	C407.820221,417.802124 407.271088,419.741272 407.277344,421.473450 
	C407.326080,434.971985 407.313995,448.470856 407.289154,461.969543 
	C407.281067,466.380402 403.084106,471.509949 398.908539,472.391663 
	C396.705048,472.856964 395.546753,471.321716 394.258209,470.056396 
	C388.907776,464.802551 383.577240,459.528473 377.987549,454.013489 
z"
      />
    </svg>
  );
};

export default OwlLogo;
