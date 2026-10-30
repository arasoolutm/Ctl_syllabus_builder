import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BookOpen, User, MessageSquare, Target, Library, Scale, Gavel,
  ShieldCheck, CalendarDays, FileDown, Check, AlertTriangle, Plus, Trash2,
  Save, Upload, Printer, Lock, Info, ChevronRight, Maximize2, Minimize2, FlaskConical
} from "lucide-react";

/* ============================================================
   UTM SYLLABUS BUILDER  ·  Center for Teaching and Learning
   Fill in the left. Watch the right. Export to Word or PDF.
   No accounts, no server, no stored data.
   commit branch check
   ============================================================ */



const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAggAAACkBAMAAAAAk8vsAAAAMFBMVEX///////7+/v79/f38/Pz18/HY1tTOnmv/hQL/gwL/gwB5hpZ+bmElOVQNJUQLI0JmWK/zAAAZI0lEQVR42u2ce3wUZZb3v1XdDbhAUh0EFKFT3YmAjomdEFg0XJoQXlm5yIuK7qoMgwu6M4oIrtdBLrP6ssu7EFHmA7hgZmDed1WQiJdF7WTaENEZQqaMzgyXpFMkERgu6UrU+Qh0Ve0f3Z10hw4kYRzy2U/9Ph+gq+o5z+X3nOec85yqB7BgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFC39VCElvSvEXTXEXbi2+nKkllLwQqer32nnR1Zn6RTnYHRL+orClOwWTUIpChqQriDlmFaJbgpARHUKGdEaFjNQqRG9zLYg5ugKjzCoipclIrcLjBLO5FjIks9ntB7CHbZPCgWgZjyAJJiFDZRQHsHkPxNrP7KfYb1LA40QKNdd2mgTHrPirN9t+yt/64p8YOwf6LkrA+ZLOc6XjVSDyVysSr+I6ogLyV9OS1y8akT8Rphyz3rSHL9q2PVkLI0fF6/wOs+3iQSmRhMnei9Z+Qlbl8SswmyVOTOhTHZKeeG9PqtBQlLU45IQvViiA/IOXtNQR8g3rtQ1S1uKz2fiWpZsPNY1/rPmqrPHLUoWGVYeqtYaiZenNEuYT1Ve9rTk5dLusYjt1kEHnlG82pQt/fEReJhMSJL5YP2SFdm7e/+e7ByKL4KYfrOLFFwKqb1l6swRLlSQrSExOZdzPOF2xfSW1LyVebDGiguw0gqIcVN3CkCLPuRZjU65ru3roqOfQ2qNIAOqpBs/h7ODhomuP1v9JGHy/r36TeBjlTy3utcP2bs1wbWsa8lL6tpZNonxorSilnFvvObRu7LtpkPXO6rWr50nBTWJKMZq7qS43O9gMJ+s9W1xb5a0RTbD/YdW/PvP1mga5fpMoH1orSFInl4M8cpIUZ/yeadUEm32lM15Hmp69N+ciltEMPWfgy2ooKRs5xF6dHe51orwoQFXvLIP+6gD6vrciAEC/+iWKQq8a2WDRymPZOnNFNcDctYN1qBp2bZi+h1wGi5YNJGuUovRtWFJclnVt2Gb7aiCLZi9WKBvpMowj1xNs8fb9ZJ7S/+iShvKjw3QAfM+3zKLv17uLAixaNpD+dypK55YDmG1jNeL8gSkQT4LRBAk32sEIuWth5t8VQmH4K9PulWxQiAR2H3dpLVqkaruPFrD7voY8TTLuCNpNUWOUSU4lk3+x1sQuVk4IFAoU8uko7D7BPrl4nYHgOO+YuGW+QiGSHHScKxSwFwoNiv1a5xPzev12fADAfuzmBQX1Q5UxFUQq6LRN6BCuqWJXiqtGELQ3XWEIGAHsCthGmQBGANNIiZnfAAYQkOC0WTZpyaLTGKALKPDrv2l+QBFv2q0RBq3flGLsAcJ6CBeN9L5ve4FdNMKgwppgA+Ea9SPCQ9S03/14W3Tujhm7w7iKl5utFVwmCR5DkrpQvIlT6SqKggswZBXQS0EbDMABdV9dEn/1es6I6pvizEoZs1TmTg0DVPbaoQUAuy1gNobtiM+x7aeRpW8Yv8QW9QsUPZ8195aIP7gpG7mGwP4VM9S4Ci6DhIza3s4ukNAkhd5RgVERj60C9FoI7sjjKb3kZJHOuRUrdhTFragh2vV7PUPkGoA5g1MACJcuOpdeawwJZawhNrPihHIAA6ioXD5mSHYVAJKzrwqiETGIC3unXOZyEGvHFHQhtDI17VAI4ECcFZ46FkE6BiBu4ruk4cLGovw7/6GNhOvUkcKxc/0Art4olQPw3P05S/tj9F23asCrDbURKo1A20odwlP7Y6O9I9obgKtXS+Xa5ZHg+tsc5M6TEDJ/s9toT8xnxfB0bwDzYcdz7Sg1AfRbA96dO9tuaiXLzdwiCeD0c70f1AA0j7E9DF9+yfqvHy26QJ/CQ5SJC9UkTvDMs70fvFREcAlF+CpHSOuKIvymxHXB3ZObN2+OdM/cvKHdpDhOA/DNDMbExYFfbhV+6C2PLOTNmyLd3fCY7X4fhMMvP+IcvTdJV99u+riVhG/lCMEamJs3oVwWCemTEbpiFo13k6x52+RRk6OV3FlYFE7YsMlkA4RHK33ig+Fz0sxF9ZGfeRPXVwHYPxDmAX1nF2xY5EyyQpvMNpV9W6gDE7NeAfImFF2eJpiy2IXFQJ2RbIen6wf02M+azY5Y1eZsCerVCD2NM5gUp9sudfi5qEopH229GyA8PjS8Ars41yjcqiUfTKxttUmc5YVcoxxA8RdfHglpXVEDkE4b8XbHB+DFDjbwghd7pu+/ogbpPK7GwnHzSzRsml0KjlaaAdE0vQBD1WuOuCId9RWy0o4Xm/5Sb58XQ7ZrPsxojeDDiEyTLdoe0PgWDwzIGJ9z0oUIPnyXR0KwSzECmthW3I/DD6Bo4QBnED7HUKjx77s5unCytevC/n2PbFfo75weMBrWmoAhCJUA6mv8UgMME7//vlTDVEz96y1pjyicv85fWX4yCx3td4Dxa8SI7TgD/tiivFEbU1r7yeI1LgwTP4HLIkEc2KVgEYKtiir+xGt/3wfpDzHtLtsgufePPHnzhTUfHTwZUXMjvM720Ud7DmYj9loxfDbqIQ3EgfNsC3xA41v6bgVExzzxI//L+ye4H2Shc0ho3LwJ5tf7FiqrEP8s954vIzoedg5ZIAMMj4oCxqnn+7w/Z8932wPit/NsC2Qui4S0erNL0aK5u9UkyLObgsMlWaxfHKxeoo9oUpfUVy8Kejz6c1FnXr2xypb73Ywq5OFG7/keve9yEPa5gk9KMpjXnUoH5D+nqB73mTv31j/WNGjokOdDYvC6f+/91MESRR5uqAsbEIXHa48+2Qh4R6QEn5Kje/z67ctG/J+UH4+DXil1T8pypzNL8kifp83Kq8+YiDkHHna7L3AAwWfvzXEnVQO5dkuww3RILN8R+xevktcv0JY/EQ1fANHAFjGis0raJVOIPbHNKIncsOkXZFxaY/2gY8Zb0eei0fmkyoXIPnCP7OyCa6Buf1xmUsxNrVUBMdeoQs1LLQXbpCZN7BcbdvXkUrHQD5AXVsCQA2BkpkeCQTHKQYYc0tIqQcwNK/qo5rBKXr+SgjIgL7WUWPUAap50upXRYKH/rcIaFciQS7uQY7xAE0QWuN0XluxIE8y6JNHipfZmHadMZfX7TrR2ShOyx8pCc+dNQsh41paidc2MXmxH3nFA1qlkthG8JE2dyYH+UaYL+0cz9OGAYV3j4AqjM5owbKrg7kqwqO/Vz/xVOp/hDp1pU4YMZ2qo6vsiQfxW7trbiZqs+G2KzSvFi4f0L29GiObvzDPKKKepB9pGBTRVjXKaZ1qrGOUEM1Rl87ZJRcZqGx+oRSz0R2yGWOAHCk8rYE9o4ELBbmlCS1e20JjmtgSHpR9oX+JAuwtb60Vt7YX3DnRQjS0rMEfiZIk9ogsT/FPcNO2wexXCBy7efndIMCZ1TblMOT5tZuvzuUYobr/4yv7dhDA1QJDO3rfFEL4piqqCd/xcDWHIjaWGsF2N3vMtS9EQhmT3rsbUTA3A+TdZOozfVzpJE5oW3i6rgOeTR5ZIpFa98A6eW1e2NuBsWNrwxzjB7HA3SRDkLkXMIbMuwaBkDUhIQ0iL79PcsZhD+q5h1xLpu4rWKGlABnwq71rFjbFkRMuuJRnwqSxqbqIVOY8LYN/3WXppyf/OveXI+SwdMViaU3vQkZnxqjJVvUWUWhvofdSj5sQEhXD3NUFKcDId7qhjhU4lem/JlDRA0iQtEpd8O/YDb0TJ09zf8crhjdL90Wmvqnr1UOqJabwSennwdC127/BG6fg0GPNRTEoCGJc9bGkxG+77WcYJAeRbvJ9Og14fTMwdpv7qjUOSWQWQIRnhw5PLvNRqgDjpTLdJcHRtE0194p7a2f9hgL/3HiwCuPfqxnGv/eLMFADHByPI+7Bo5ZPZ0cKZNYveLi8oK/zV1ctfiN3L+3DdyiO+gG38Hc1NUamxYN/31pJfFsKvhPUOwL30xLRCqLntYKqXxvyiohNTAHp9JmLzzaxPHQ1g//Gy7nuHdorRkcLETEJJQgmJTzYDXOU9txng/31mVPR5iUKA8B0HzcrMLStGxKa9xv4BNgN/5pbl1/iiKdTKzK2r3gG9YoRmRqUOmbjy9e3ZfsjcvnQo2D9Lf7DAD7bxRUWSpDb0R4oULZ7vVT7+W7RMGTC3PN1tEsKJove6kzpMU90TSB7mbpusgQS2PBOE3m5Ih0AYsN8QgrpRQvMLM2NMutWdgOpBeHR9tB7VI+nRyDEidVsquH50YkIZUFOwdi248o13w4BesX8lErUno0UzXJoE+yFYA9hv67530BMj+Y6TSZIGILbjYNYqVQUf6FUG2EU1LhBWw9mKflpLN2RdjQ9xzTohNf+u1q1Iu/Az0DSsvlGujihcuVhk4nKeT68FCI8LJXRdSxANmEZ3w+YufsfRrh1N3xvPSvjcfW0FzLNFgKuuWXzUk8C4rmvNth2+Dho4v0wS6qVoz8M3abrMrFDMJRXNijdPe4rjGjfOPee6zJcv3YQypR3rSnzetTjqQPLvSlxE2aZktqpCexLOFWOn1Vqn1M9S2q7qUxKLxieuDaP48jJLlxHgtxuCnBBSR1Nxth2Jy0zSgpr9/g5UweYDtJhCqf+hqZrkzI1cHd1TEr8C7AnVij6ujCZQ2/HO2DYsohbHBan9tGvHb5ReTK68YlYAcF4fDbFUFaTm/kokMxVTrmgDQ+P1S8wOXClNuJjJjXax33JpQPtpP78udXByVTAUMNFGTs+LTHMmELLv+LIgMqveJA20CfY4EsTh8yLDaHn9aPOLFe0ebtRa/nlvMinHPBl9WKj5xcqGyQA1QAnTppcVykA4bqRir1lyO8GeR8KxaB+NW9eZ7afduFUxr7nDm4y6xTIMU4Ubjswojc57fZ1pW/OP/saCxKLu26R4EsYs5krZhOTwAeFWS/7NxqLmf85u17MZDcKSRRdK8RuAhnW/YMD/XXi7UlAG1DdCxqbZm0sK/QkNuFuiVwUAn3WUqbtSJPgBymJ9DN8a8F5zRzBhzYZHK94R1YmeMyKlAWqDJuBJO/JCsS8AYZ/iQ7zl+gXTRh2IK+rYuipecBE9SxOcC4F7fLtj1xUzGoTHlyeWaZxZb9uR8PlB2kJgjm83oGc9/zIIGVvunimrUDHjCzkkZKS9f7sv4gEcC4F7YllBaSHgWFHfQeL6CpFgWw0IbR7dGK14R5Yn9jE4SmvnOcU4qS+UH+WA5hy7czYQHvfvP3OGEG/ZNyES5doTGhBXx3ZzPc9FtvXJaHye9gGTcX65lCx2jkjpntuWqUghMX+mDFRsWKYCjIy3r4lvDgVnD1sOp39iwqClcSlqQbsgYPryD6ukMfGes+mZEDijm9qgb8OphyY5Ndu/LFIhnLfh1fdzBYRIhGWe+YkJg16J8fmU1ibYcwzjGwB3xoU1fZf/QotlmGKm0beuKPV+tS1YMDYD9Ik6wvLCN9566AlJ0ssBKvMqC+c8lGv2mVulAH0TGtBeBfhuidazSMgzwVk8O3Ha28fJFfuKmp/MbiclvBaVMvyZQze8+sFE2/2KAlTafG/s2pNrzgy2NVCSILhrSQ9zkUoYxL6zE6Z9xTUXqELAO3h6Q3WClL1P60qvCRb6bzsozYqMTS/NHHrbR97op1xKGLza7KJIySoD7COkHhg2C2fjd3wVG6XmJ9vFzhUzEF5obpfCOlekRTYMYPjtty4XZC26WawpnzA9VWjLf1TvLIlPJxxRemDYrJ8rjguPwrcGzMHTE+NkY7TCYCmZVE1MquJ1HNXh6FiNwOjPHXHi3ybmVGapPdBFJuz4ItPekkhC4yLEn3ovTCfIc2IdD98YQmjdKBm2hLxJ59IJV5aEsBLfvjFaYXBivp66sxr5n7dThQCi/E8z5db8C/rY+bGrxDcLYTWhgcClz7h0BPP75CE7ftrXIu5oN+C+yyXbW0mkdqXJrSMwxd+5tI4acF3kqtMkCMyWv8fw+cv4aT+kkd+uwJevHxVuCyWRmtkaXUs1Bcagr2PbC/omFm1MuGrwdctFCpKreUDSUPcvgfFZLycGTIKt3YrxrVtpd18g1RCKhZK2gVIJOI7G1OmOoCvupaE4/rm/ixccZkt2vq4TccKgxO+dpv4Fsyq+ip0/18X4gCmqdZrU0hYwtZeatHfLgtJ10eOCwh/M+vrzV0cjDNu3cnUcCeKE/XFWVSz4+PDjWreCJaf2pHb5pjRBSgafX3S7wx9/ZAgY0jdx0x4p/Y3U2BYwRQ+byeDz40nrV/poSnlvcccTAOK47LPlpqg9mS2rwKRPU19WQQZvpeh2n/7kw/MA5FbiSevnf7T/O3q3SBDSSHi3LnbnUK3NMLEX1ET8tHwUyjxGba3jx97jLvETuf7q6Ca6Yt+KSJ+r5Wpb7N6MhkgdKoLfYwSDjkfWH5ePkz+UdNXZb9/W344LEBpx//bJITHVX3YioFN4FZriMWprHXsm7h5XcT1SpccIBu0/WX9c6GbYnGoIiZayO3HRJ1vNwdHUl1izSArN/w/uHjQ711yTovRlkL912hUvQOUDzcNjizA8TskBCP+9xIJXmTJ8dm7o2fR6wfbzG2vA8eGw4WHGq841Wgnw6M1LsxTR/5jW+4dbxDkDH3Sb29RwPcJ705jivmdS6LfjAt0jocOzHlqnv/QV7f/lxnx/s6ICrjGPC2mbnkGQm9G3D53zr07z/c0lxE27PG2plNJ6r/H53YA8aJXA6qejUuG8qtxrj6wJOe/NWjAuQMtbPtYMCjnvydm3TceV/5iTzc8iyM3moRKzV7mTsbXgbm7W7xraaU1QOzUyUzvSWeeZPTHX1ISxrpmArddqiZDgCSFIxoMT6ldLIWGsN7pWjdEK2I79TAgJY9Org7FUA5ro+M82qXfGBSqn7skZsNoZOvPE9jBUVZlPDFjtDKXume5VbMdeFggJnpAgSMaS8Y1vyDFB893sqs6SUN+rUyMLGdv6j+wcCdrxpwD0IGDWrQZTcwKY2/RI5suMRmRG/Yy7VdN4urU0oPd91KEZ8VJbdcifvPBuePNwebYC5G44tQDOby4pKMPk6dai57bp4sY2wVflDmKhJFbMvtLTiZEFTyjK1NbPes26zwJa1zPvFyzRJLnQC77L9gXANrEMwB5d5JFcu+gra1c0MSzwBTqfT+hUoGyYL+udjpwy0zUQ+gUi7poQmoQTjDIoDLU+AWiU1cg9Zzh2z8gMq1CYIIVelieBWRst5M+UgdNlcQ0IEjRVxQuapXRaE0Tbv7g7owi7g9LlakLPQLLQx+hvXto0mlQb/A9B0uXg0i59AjKkB/5nk6CqlzzhYWj7O3XY4K+ize5aQJQNFcRsBUQZQVcRvRogVXmQqjyCriLKyc8UJCWhZZf3kk7PSBqFXxEYtRD75stQoj9FXyB6EIYgEETs+OSDvYNMhHYJw68dzlJ6CAfyaN4E0ZPTtxgxI6tKZfjNOE/ujv3/ODv/MSScHMgplTEmO43OkmCcjz/WmNw/bg/3FEVIu+bx+4oC4vEPfh9QxWOvrlDF61eDtPTLP24yNSRj1z2y8dA1jx9bZAx6/GxVbaczS6JyiVBB/VN2jzFrykYyVbLvvGq2imv28AaM37+UMvLzNYp48Bnh7DPVTBV+r20URlRrr7z0b/07n15Ty0zt4opQHuwxJBj5qqcRYx43g+tHjqNgq8OcIY6b9W+btcObXxuXr9lS8usG7JC9dV9rnSfBuFHTLm4WlR4UGIn0Trd9myMp0OhKmymjS7jzBcl4dzK2ya9rLZKOuEvJr9AkvSuJ1i/WGRfdP+7vOasBDLN5/KRjIQTsx88enSsDqAGz5VdDz6Dr1ykGYJjL7TvkLkSMgHmtVnex/eM7Cj2JBXVe0+wiwBRr1UwV4Pycs+WRg0HRNxnCHu1/7e0aCYa4Dq1jRTic1aMiPql4eNPcZmDivJmvpTUCabXrn70p4r9iKn3d2j4PdI0E1BvqmjokwdzeoxQBfu34akiqBsa8hVIvE2haS3sn37jp6Itq10gwqrdS16F/vKlncSAFbXNOAbZj8lOL037oAzZoS1ralbp13WBv10jAuPF3ZlMHdmh9z9oza5xj/i9DDoSvvsgYqc4EyC0aXJ2ovnLFxpYVXSSBL15XtaZkyqDpstqjSBhAvpJdDD75zu0F+epouwhpW8XpMgMQATt27IIavnWFsyt7BwA9bePDstiUZNIr49yneeWDJrGUQPZIV8lav2/eEk0uWeb3agQ8znlF9aWSGIBKwgHvrJep2P98VzWBJu/GOiMJB/runqUI7vsGvPfayevftr93zPtzz5/n2d8btNL29pDAeNn3iDTsXTnjPmnagz+Y9IeC8OjqrmoCKJ5N1xdcuJH6U1wiIRSKX5pXBv2lZdOuXR948qe3Oz5zoJzYcnvgzJbbK6aW1AdveNpxe72Lzxw6exwp8t7pU7pR/6guKk9PgtzJe1zypZonyf+yFXdaP3Z+B2h3DvyviUzZ+DirugCj3IffNgnj40kYZfaJpRRCOECmzOlvZPxgD2PBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixY6DH4b1fGPQSWKw1uAAAAAElFTkSuQmCC";

const UtmMark = ({ style, textColor = "#fff" }) => (
  <svg viewBox="0 0 177.1 41.5" style={style} role="img" aria-label="The University of Tennessee at Martin">
    <path fill={textColor} d="M74.7,30.3c0,0.5-0.6,0.5-0.9,0.5c-0.2,0-0.5,0-0.9,0c-0.9-0.1-2.1-0.1-3.2,0 c-0.4,0-0.8,0.1-1.2,0.1c-0.4,0-0.6-0.3-0.6-0.5c0-0.5,0.4-0.7,0.8-0.8c0.5-0.2,1.1-0.4,1-1.6l-0.3-11.2c0-0.5-0.1-0.8-0.1-0.9 c-0.1,0-0.3,0.2-0.5,0.7l-6,12.2c0,0.1-0.1,0.2-0.1,0.3c-0.4,0.9-0.7,1.3-1,1.3c-0.4,0-0.6-0.6-0.8-0.9l0-0.1l-6.2-12.9 c0-0.1,0-0.1-0.1-0.1c0,0,0,0.1,0,0.2l-0.3,10.1c-0.1,2.3,0.9,2.6,1.7,2.8c0.4,0.1,0.9,0.2,0.9,0.8c0,0.6-0.7,0.6-1,0.6 c-0.2,0-0.5,0-0.8,0c-0.5,0-1.2-0.1-1.7-0.1c-0.9,0-1.5,0-1.9,0.1c-0.2,0-0.4,0-0.6,0c-0.3,0-0.5-0.2-0.5-0.6c0-0.5,0.4-0.7,0.7-0.8 c0.5-0.1,1.2-0.3,1.3-2.1c0.1-1.3,0.2-2.5,0.3-3.6c0.2-2.8,0.4-5,0.4-7.2c0-4.8-1.4-5.2-2.1-5.5c-0.3-0.1-0.7-0.2-0.7-0.7c0-0.2,0.1-0.6,0.7-0.6c0.3,0,0.5,0,0.8,0.1c0.5,0.1,1,0.1,1.5,0c0.3,0,0.5-0.1,0.8-0.1c0.5,0,0.6,0.4,0.7,0.7 c0,0.1,0.1,0.1,0.1,0.2l7,14.9c0.1,0.2,0.2,0.5,0.3,0.5c0.1-0.2,0.4-0.8,0.7-1.3l0-0.1L69.9,11c0-0.1,0.1-0.1,0.1-0.2 c0.2-0.4,0.4-0.9,0.8-0.9c0.2,0,0.6,0,0.9,0.1c0.2,0,0.4,0,0.5,0c0.3,0,0.6,0,0.8-0.1c0.2,0,0.4-0.1,0.6-0.1c0.3,0,0.5,0.3,0.5,0.6 c0,0.5-0.4,0.6-0.8,0.7c-0.7,0.2-1.5,0.3-1.4,2.4l0.4,14.4c0.1,1.3,0.7,1.4,1.4,1.6C74.1,29.6,74.7,29.7,74.7,30.3z M98.5,30.3 c0,0.5-0.5,0.5-0.6,0.5c-0.6,0-1.2,0-1.8-0.1c-1,0-2-0.1-2.9,0c-0.4,0-0.8,0.1-1.2,0.1c-0.6,0-0.9-0.2-0.9-0.5 c0-0.5,0.5-0.6,0.9-0.8c0.5-0.2,0.9-0.3,0.9-0.7c0-0.4-0.4-1.3-0.6-2.1c-0.1-0.2-0.2-0.4-0.2-0.6L91,23.8c-0.3-0.7-0.4-0.9-1-0.9 h-6.4c-0.6,0-0.9,0-1.1,0.5l-1.9,4.1c-0.1,0.2-0.2,0.6-0.2,0.9c0,1.1,0.6,1.2,1.2,1.3c0.4,0.1,0.9,0.2,0.9,0.6 c0,0.5-0.2,0.7-0.7,0.7l-0.3,0c-0.4,0-0.8,0-1.2-0.1c-0.8-0.1-1.6-0.1-2.4,0c-0.4,0-0.8,0.1-1.2,0.1c-0.3,0-0.5-0.2-0.5-0.6c0-0.4,0.4-0.5,0.7-0.6c0.4-0.1,1-0.3,1.5-1.2l6.9-14.8c0.4-0.9,0.7-1.6,1-2.2c0.8-1.8,0.9-2.1,1.4-2.1c0.4,0,0.6,0.6,0.8,1.1 c0,0.1,0,0.1,0,0.2l6,14.9c0.1,0.3,0.2,0.6,0.3,0.9c0.3,0.8,0.6,1.7,1.1,2.4c0.4,0.7,1.1,0.8,1.6,0.9C98,29.7,98.5,29.8,98.5,30.3z M89.8,20.8l-2.8-7c0,0,0,0,0,0c0,0,0,0,0,0l-3.3,7c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0,0,0c0,0,0.1,0,0.2,0h5.7c0.3,0,0.3,0,0.3,0 C89.9,21,89.9,21,89.8,20.8z M118.9,30.3c0,0.3-0.3,0.6-2.1,0.6c-2.2,0-3.4-1.5-4.5-3.2l-3.2-5.1c-0.1-0.2-0.2-0.3-0.3-0.5 c-0.6-1-0.6-1-2.5-1l-0.8,0c-0.3,0-0.4,0.1-0.5,0.1c-0.1,0.1-0.1,0.2,0,0.3c0,0,0,0.1,0,0.1v6.1c0,1.3,0.9,1.5,1.8,1.7 c0.6,0.1,1.2,0.3,1.2,0.8c0,0.2-0.1,0.5-0.5,0.5l-0.2,0c-0.1,0-0.2,0-0.3,0c-0.4,0-1.2-0.1-3-0.1c-0.5,0-1.1,0-1.6,0.1 c-0.5,0-1.1,0.1-1.7,0.1c-0.3,0-0.5-0.2-0.5-0.6c0-0.4,0.4-0.6,0.8-0.7c0.6-0.3,1.3-0.5,1.3-1.8V13c0-1.5-0.8-1.7-1.5-1.8 c-0.4-0.1-1-0.2-1-0.8c0-0.3,0.4-0.6,0.8-0.6c0.2,0,0.3,0,0.5,0c0.2,0,0.5,0.1,1.4,0.1c0.9,0,1.7,0,2.5-0.1c0.8,0,1.6-0.1,2.3-0.1l0.1,0c0.1,0,0.3,0,0.6,0c1.9,0,6.4,0.5,6.4,5.3c0,2.1-1.4,4.2-3.5,5.1l4.7,7.1c1.3,2,2.4,2.3,2.9,2.4 C118.5,29.8,118.9,29.8,118.9,30.3z M106.2,11.3l-0.3,0c-0.9,0-1.1,0-1.1,0.8v7.4c0,0,0.2,0.2,1.4,0.2h0c0.2,0,0.5,0,0.7,0 c0.2,0,0.5,0,0.7,0c0.9,0,3.8-0.3,3.8-3.9C111.5,11.7,107.8,11.3,106.2,11.3z M136.1,10.9c0-0.8-0.3-1.1-1.1-1.1c-0.1,0-0.4,0-0.8,0 c-1.2,0-3.7,0.1-7.6,0.1c-2.1,0-3.7,0-5.1-0.1c-1.1,0-2.1,0-3.1,0c-0.7,0-0.7,0.8-0.8,1.2l-0.3,3c0,0.3,0.2,0.6,0.5,0.6 c0.5,0,0.6-0.4,0.7-0.7l0.1-0.3c0.5-1.4,0.5-1.7,2.1-1.7l4.7,0c0,0,0.1,0.2,0.1,1c0,0.1,0,0.1,0,0.1v15.1c0,0.9-0.7,1.2-1.4,1.4 c-0.5,0.2-0.9,0.3-0.9,0.8c0,0.4,0.2,0.6,0.6,0.6c0,0,0.1,0,0.2,0c0.3,0,1.2-0.1,3.8-0.1c0.4,0,0.9,0,1.3,0.1c0.4,0,0.7,0.1,1.1,0.1 c0.2,0,0.3-0.1,0.4-0.1c0.1-0.1,0.1-0.3,0.1-0.4c0-0.5-0.5-0.6-0.9-0.7c-0.7-0.2-1.4-0.3-1.4-1.6V13.1l0-0.4c0-0.3,0-0.7,0-0.7 c0,0,0.3,0,0.4,0l4.6,0c1.6,0,1.7,0.7,1.8,1.3c0,0.4,0.1,0.9,0.7,0.9c0.2,0,0.3-0.1,0.4-0.2c0.2-0.2,0.2-0.5,0.1-0.7L136.1,10.9zM144.8,29.5c-0.9-0.2-1.5-0.4-1.5-1.4V12.6c0-1.2,0.7-1.4,1.3-1.6c0.4-0.1,0.8-0.2,0.8-0.7c0-0.5-0.5-0.5-0.8-0.5 c-0.5,0-0.9,0-1.4,0.1c-1,0.1-2,0.1-2.9,0c-0.5,0-1.1-0.1-1.6-0.1c-0.5,0-0.5,0.3-0.5,0.6c0,0.4,0.4,0.5,0.9,0.6 c0.7,0.2,1.5,0.4,1.5,1.5v14.8c0,1.7-0.8,1.9-1.4,2.1c-0.4,0.1-0.8,0.2-0.8,0.7c0,0.6,0.4,0.7,0.8,0.7c0.1,0,0.3,0,0.5,0 c0.4,0,1.1-0.1,2.3-0.1c0.7,0,1.4,0,2,0.1c0.4,0,0.8,0,1.1,0c0.3,0,0.8,0,0.8-0.5C145.9,29.8,145.3,29.6,144.8,29.5z M168.2,9.9 c-0.3,0-0.8,0-1.2,0.1c-0.5,0-1.2,0.1-1.7,0.1c-0.5,0-0.9,0-1.3-0.1c-0.4,0-0.9-0.1-1.3-0.1c-0.3,0-0.6,0.2-0.6,0.5 c0,0.5,0.5,0.6,1,0.8c0.9,0.2,2.2,0.5,2.2,2.9v12c0,0,0,0,0,0l-13.8-15.4c0,0-0.1-0.1-0.1-0.1c-0.2-0.3-0.5-0.6-0.8-0.6 c-0.2,0-0.5,0-0.7,0.1c-0.5,0.1-0.9,0.1-1.3,0c-0.2,0-0.5-0.1-0.7-0.1c-0.2,0-0.7,0.2-0.7,0.5c0,0.5,0.5,0.6,0.9,0.7 c1,0.2,2.6,0.6,2.6,4.7v10.7c0,2.5-1,2.8-1.7,3c-0.4,0.1-0.8,0.2-0.8,0.8c0,0.4,0.2,0.6,0.6,0.6c0.1,0,0.3,0,0.5,0 c0.6,0,1.5-0.1,2.2-0.1c0.8,0,1.5,0,2,0.1c0.4,0,0.7,0,1,0c0.1,0,0.6,0,0.6-0.6c0-0.5-0.5-0.6-0.9-0.6c-0.8-0.1-1.6-0.3-1.6-1.7V16 c0-0.2,0-0.3,0-0.4c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0.1,0.1,0.1,0.1l12.5,14c0.6,0.6,0.9,0.9,1.3,0.9c0.5,0,0.5-0.7,0.5-1.5V12.7 c0-1.2,0.5-1.4,1-1.6c0.3-0.1,0.7-0.3,0.7-0.7C168.7,10.1,168.5,9.9,168.2,9.9z" />
    <path fill="#FF8200" d="M38.5,17v13.9h-6V9.5h16.1c-0.3,0.3-0.2,0.8-0.7,1.5c-0.6,0.8-1.2,0.4-1.7,1 c-0.4,0.5-0.3,1.1-0.7,1.7c-0.6,0.8-1.5,0.5-2.2,1.3c-0.5,0.7-0.5,1.3-1,2H38.5z" />
    <path fill="#FF8200" d="M24.1,9.5c-0.3,0.3-0.2,0.9-0.7,1.5c-0.6,0.8-1.2,0.4-1.7,1c-0.4,0.5-0.3,1.1-0.7,1.6 c-0.6,0.8-1.5,0.5-2.2,1.3c-0.5,0.7-0.5,1.3-1,2h7.8v7h-6.5c-0.5,0-1,0.1-1.3-0.3c-0.3-0.3-0.3-0.6-0.3-1l0-13.1h-6.9l0,15.1 c0,1.8,1.2,3.5,1.8,4.1c0.8,0.8,2.5,2.2,4.5,2.2h9.1l5.5-6.3l0-15.1h34.1z" />
  </svg>
);

const C = {
  navy: "#0B2240",      // UT Martin PMS 289
  orange: "#FF8300",    // UT Martin PMS 151
  ink: "#1a1a1a",
  slate: "#4A5568",
  line: "#D8DEE7",
  paper: "#FFFFFF",
  wash: "#F4F6F9",
  good: "#1E7A46",
  warn: "#B45309",
};

const UI = {
  wash: "var(--wash)",
  paper: "var(--paper)",
  tint: "var(--tint)",
  line: "var(--line)",
  ink: "var(--ink)",
  slate: "var(--slate)",
  muted: "var(--muted)",
  navy: "var(--navy)",
  orange: "var(--orange)",
  good: "var(--good)",
  goodBg: "var(--goodBg)",
  warn: "var(--warn)",
  warnBg: "var(--warnBg)",
};

/* ---------- Institutional content maintained by CTL ---------- */

const SLO_PRIMER = `A student learning outcome describes what a student will be able to DO by the end of this course. It is not a list of what you will cover. That difference is the whole thing. "We will cover the causes of the Cold War" is a topic. "Students will evaluate competing explanations for the outbreak of the Cold War using primary sources" is an outcome, because you can point to a specific assignment that shows whether a student did it or not.

Three tests for a workable outcome:

1. Can you see it? Use verbs a person can observe: analyze, construct, evaluate, compare, design, defend, calculate, diagnose. Avoid understand, appreciate, know, and be familiar with. Nothing a student does can prove or disprove those.

2. Can you grade it? Every outcome should connect to at least one assignment, exam, project, or performance in this course. If nothing in your grade breakdown produces evidence for an outcome, then either the outcome or the assessment plan needs to change. This builder checks that for you.

3. Would a student recognize it? Outcomes are written for students, not for reviewers. A student reading the list should come away knowing what they are being asked to get good at.

Three to six outcomes is the usual range. Past that they stop working as a guide and start reading as a wall.

WHY THE GENERAL EDUCATION OUTCOMES ARE ALSO LISTED

If this course carries General Education credit, it is doing two jobs at once. It teaches your discipline, and it also delivers outcomes that belong to UTM's General Education curriculum as a whole. Those Gen Ed outcomes are what the university reports to SACSCOC and THEC as evidence that the curriculum actually works, and that evidence comes from courses like this one. Listing them next to your own outcomes does two useful things. It tells a student why this course satisfies a requirement they did not personally choose, and it tells the next person reviewing the program exactly where that requirement gets met.

You still write your own course outcomes. The Gen Ed set sits alongside them, not instead of them.

Delete this box once your outcomes are written. It is here to explain, not to print.`;

const OUTCOME_LIBRARY = [
  {
    group: "General Education · Social and Behavioral Sciences",
    note: "UTM General Education curriculum outcomes. Include verbatim if this course carries Gen Ed credit.",
    items: [
      "Students will describe the influence of geographic, political, economic, cultural, and/or family institutions on the individual and society.",
      "Students will explain the connection between social/behavioral science research and everyday life.",
      "Students will analyze key ethical issues as examined by the social/behavioral sciences.",
    ],
  },
  {
    group: "Program example · Political Science and Global Studies",
    note: "Shown as a worked example of program-level outcomes. CTL loads your department's set on request.",
    items: [
      "Describe political structures and processes, including those relating to elections, policy making, and policy implementation.",
      "Demonstrate an understanding of global political dynamics, encompassing an appreciation for the interconnectedness of international political, economic, and social activity.",
      "Produce a research project demonstrating analytical skills while applying contemporary methods of political science research.",
      "Write and present findings from an original research or critical thinking project.",
    ],
  },
];

const AI_POLICIES = {
  mixed: {
    label: "Mixed use · permitted on designated assignments",
    text: `In this course, students are permitted to use generative AI tools only for specific assignments, as designated by the instructor.

Understand tool limitations. AI tools may not always provide accurate or up-to-date information. They can draw on plagiarized sources and produce fictional citations. Treat anything they give you as a starting point for further research and verification, never as a finished answer.

Cite AI use. If you incorporate AI-generated information, cite it as "Generated using [AI tool]." Paraphrase and synthesize in your own words, and list the exact prompt you used as part of your citation.

Engage in original thought. AI tools supplement critical thinking and independent research. They do not replace them.

Respect academic integrity. All work must adhere to the academic integrity policies of this course and the university. Unpermitted use of AI is a form of academic misconduct under the UTM Student Code of Conduct.

Ask. If you are unsure whether a particular use is permitted, ask before you submit. That conversation is always easier before the fact than after.`,
  },
  open: {
    label: "Unrestricted use · AI permitted throughout",
    text: `In this course, you may use generative AI tools to support your learning and research. These tools can be genuinely useful, and part of what you are here to learn is how to use them well. Use them responsibly.

Understand tool limitations. AI tools are powerful but not reliable. They may return inaccurate or outdated information, draw on uncited sources, and invent citations that look real. Verify everything you intend to use.

Cite AI use. If AI-generated material informs your work, cite it as "Generated using [AI tool]" and include the prompt you used. Copying output without attribution is plagiarism.

Engage in original thought. Use these tools to extend your thinking, not to stand in for it. Your own analysis and voice are what is being assessed.

Respect academic integrity. All collaborative and AI-assisted work remains subject to the academic integrity policies of this course and the UTM Student Code of Conduct.

Ask. If you have questions about how to use a tool for a particular task, come talk to me.`,
  },
  prohibited: {
    label: "Prohibited · no AI use in this course",
    text: `Use of AI tools is not permitted in this course on any assignment. All work in this course will be produced by the student. Use of AI tools will be considered a violation of academic integrity and will be handled under the UTM Student Code of Conduct.`,
  },
  custom: { label: "Write my own", text: "" },
};

const LATE_POLICIES = [
  {
    label: "Grace period",
    text: "Assignments may be submitted up to 48 hours after the deadline without penalty. After the grace period, late work is not accepted unless an extension has been arranged with the instructor. Contact me as early as possible if you need additional time.",
  },
  {
    label: "Daily late penalty",
    text: "Late assignments lose 10 percentage points per calendar day, up to five days after the deadline. Work submitted more than five days late is not accepted. Contact me before the deadline if circumstances may affect your ability to submit on time.",
  },
  {
    label: "Extensions by request",
    text: "You may request an extension before an assignment deadline. Include the assignment name and the amount of additional time you need; I will confirm a revised due date. Please contact me as early as you can so we can make a plan.",
  },
  {
    label: "Make-up work for excused absences",
    text: "Students who miss an exam or assignment because of an excused absence should contact me as soon as possible to arrange make-up work. We will agree on a reasonable completion date. For planned absences, please reach out in advance whenever possible.",
  },
  {
    label: "Late assignments and make-up exams",
    text: "Assignments may be submitted up to seven days late with a 10 percent penalty per day. Make-up exams are available for excused absences; contact me promptly to arrange a time. If you anticipate missing a deadline or exam, please get in touch as early as possible.",
  },
];

const LOCKED = {
  integrity: {
    title: "Academic Integrity",
    text: `The University of Tennessee at Martin has chosen as its primary objective quality undergraduate education. That commitment obligates every member of the university community to promote and protect the highest standards of integrity in study, research, instruction, and evaluation. Integrity of the academic process requires fair and impartial evaluation by faculty and honest academic conduct by students.

Cheating and plagiarism will not be tolerated. Violations may result in a failing grade on the assignment, failure in the course, and a report to university administration. Students should review the UTM Standards of Conduct and the UTM Academic Integrity policy.

If you are ever unsure whether something crosses a line, ask before you submit.`,
  },
  accessibility: {
    title: "Digital Accessibility and Course Materials",
    text: `The University of Tennessee at Martin is committed to ensuring equal access to course content for all students in accordance with Title II of the Americans with Disabilities Act, the ADA Title II Final Rule (2024), and Section 504 of the Rehabilitation Act. This course works toward meeting WCAG 2.1 Level AA digital accessibility standards across all materials, including documents, slides, videos, and any linked content posted through Canvas or other course platforms.

If you encounter any course material that presents an accessibility barrier, meaning it is difficult or impossible to access using assistive technology, please notify me directly and contact the UTM Accessibility Resource Center (ARC) as soon as possible. Do not wait until an assignment deadline to report an issue. I want to make sure you are never disadvantaged while a resolution is in process.

The ARC serves as the university's coordinating office for all disability-related access needs and will partner with us to find the right solution.

Accessibility Resource Center (ARC)
206-209 Clement Hall  |  Phone: 731-881-7195  |  Email: ARC@utm.edu
Office Hours: Monday through Friday, 8:00 a.m. to 5:00 p.m.
utm.edu/offices-and-services/accessibility-resource-center/

For students with formally approved disability accommodations, please send your accommodation letter to me through the AIM portal at the start of the semester and follow up with me directly so we can discuss how your accommodations will be implemented in this course.`,
  },
  support: {
    title: "Student Resources and Support",
    text: `Learning Commons (Writing Center, tutoring, and Supplemental Instruction) — Paul Meek Library

Accessibility Resource Center — Student Success Center, 206-209 Clement Hall, 731-881-7195, ARC@utm.edu

Student Health and Counseling Services — utm.edu/departments/shcs/
Counseling walk-in hours: Monday through Friday, 10:00 a.m. to 2:00 p.m.

College can be a demanding stretch, and asking for help early is a normal part of getting through it. These offices exist for exactly that.`,
  },
  crisis: {
    title: "Crisis and Emergency Support",
    text: `Pathways Crisis Line: 1-800-372-0693
988 Suicide and Crisis Lifeline: call or text 988
National Sexual Assault Hotline: 1-800-656-4673
UTM Department of Public Safety: 731-881-7777
Emergency: 911`,
  },
  changes: {
    title: "Syllabus Subject to Change",
    text: `This syllabus lays out a general plan for the course. It is not final, and adjustments may be necessary. Any changes will be communicated through Canvas announcements, and you are responsible for checking Canvas regularly. Major assignment dates will not move without reasonable advance notice.`,
  },
};

const FALL_2026 = [
  ["August 24", "First day of classes"],
  ["August 24 to 30", "Late registration"],
  ["August 30", "Last day to add a course (Part of Term 1)"],
  ["September 3", "Administrative drop for non-payment"],
  ["September 6", "Last day to drop without a W grade"],
  ["September 7", "Labor Day holiday, no classes"],
  ["October 9", "Mid-term progress reports due"],
  ["October 12 to 13", "Fall Break, no classes"],
  ["October 16", "Last day to drop a class without documentation"],
  ["November 5 to 6", "Approved early registration for Spring 2027"],
  ["November 9 to 13", "Advising and early registration for Spring 2027"],
  ["November 25 to 29", "Thanksgiving holiday, no classes"],
  ["December 4", "Classes end"],
  ["December 7 to 11", "Final exams"],
  ["December 12", "Commencement, Elam Center"],
  ["December 14", "Final grades due by 8:30 p.m."],
];

/* Registrar's academic calendar, one entry per term. Dates are "YYYY-MM-DD".
   noClass: holidays and breaks. The schedule skips these on the days a class meets. */

const ACADEMIC_CALENDARS = {
  "Fall 2026": {
    start: "2026-08-24", end: "2026-12-04",
    finals: ["2026-12-07", "2026-12-11"],
    noClass: [
      ["2026-09-07", "2026-09-07", "Labor Day holiday"],
      ["2026-10-12", "2026-10-13", "Fall Break"],
      ["2026-11-25", "2026-11-29", "Thanksgiving holiday"],
    ],
  },
  "Spring 2027": {
    start: "2027-01-07", end: "2027-04-23",
    finals: ["2027-04-26", "2027-04-30"],
    noClass: [
      ["2027-01-18", "2027-01-18", "Martin Luther King holiday"],
      ["2027-03-22", "2027-03-28", "Spring Break"], // includes the March 26 Spring Holiday
    ],
  },
  "Maymester 2027": {
    start: "2027-05-10", end: "2027-05-28",
    noClass: [],
  },
  "Summer 2027 (Part of Term 1)": summer2027("2027-06-02", "2027-08-06"),
  "Summer 2027 (Part of Term 2)": summer2027("2027-06-02", "2027-07-01"),
  "Summer 2027 (Part of Term 3)": summer2027("2027-07-06", "2027-08-06"),
  "Fall 2027": {
    start: "2027-08-23", end: "2027-12-03",
    finals: ["2027-12-06", "2027-12-10"],
    noClass: [
      ["2027-09-06", "2027-09-06", "Labor Day holiday"],
      ["2027-10-11", "2027-10-12", "Fall Break"],
      ["2027-11-24", "2027-11-28", "Thanksgiving holiday"],
    ],
  },
};

function summer2027(start, end) {
  return {
    start, end,
    noClass: [
      ["2027-05-31", "2027-05-31", "Memorial Day holiday"],
      ["2027-06-18", "2027-06-18", "Juneteenth holiday"],
      // Registrar lists "July 02 or 5". Confirm which day is observed.
      ["2027-07-05", "2027-07-05", "July 4 holiday observed"],
    ],
  };
}

/* ---------- calendar helpers ---------- */

const CLASS_DAYS = [[1, "Mon"], [2, "Tue"], [3, "Wed"], [4, "Thu"], [5, "Fri"], [6, "Sat"]];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Parse as local time. new Date("2026-08-24") is UTC and lands a day early in US time zones.
const parseDate = (iso) => { const [y, m, dd] = iso.split("-").map(Number); return new Date(y, m - 1, dd); };
const isoDate = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
const shortDate = (iso) => { const dt = parseDate(iso); return `${MONTHS[dt.getMonth()].slice(0, 3)} ${dt.getDate()}`; };
const longRange = (a, b) => {
  const x = parseDate(a), y = parseDate(b);
  const first = `${MONTHS[x.getMonth()]} ${x.getDate()}`;
  if (a === b) return first;
  return x.getMonth() === y.getMonth() ? `${first} to ${y.getDate()}` : `${first} to ${MONTHS[y.getMonth()]} ${y.getDate()}`;
};

// One row per calendar week that has a meeting day, plus a finals row.
// Holidays are only listed when they land on a day this class meets.
function buildWeeks(cal, days) {
  if (!cal || !days.length) return [];
  const start = parseDate(cal.start), end = parseDate(cal.end);
  const sunday = new Date(start.getFullYear(), start.getMonth(), start.getDate() - start.getDay());
  const weeks = new Map();
  for (const dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    if (!days.includes(dt.getDay())) continue;
    const iso = isoDate(dt);
    const n = Math.floor(Math.round((dt - sunday) / 864e5) / 7); // round absorbs DST
    if (!weeks.has(n)) weeks.set(n, { meets: [], off: new Map() });
    const w = weeks.get(n);
    const hol = cal.noClass.find(([a, b]) => iso >= a && iso <= b);
    if (hol) w.off.set(hol[2], [...(w.off.get(hol[2]) || []), iso]);
    else w.meets.push(iso);
  }
  const rows = [...weeks.values()].map((w, i) => ({
    label: `Week ${i + 1}`,
    dates: w.meets.map(shortDate).join(", "),
    off: [...w.off].map(([name, isos]) =>
      `No class ${isos.map((x) => `${DAY_NAMES[parseDate(x).getDay()]}, ${shortDate(x)}`).join(" and ")}: ${name}`),
  }));
  if (cal.finals) rows.push({ label: "Finals", dates: longRange(...cal.finals), off: [] });
  return rows;
}

/* ---------- schedule date helpers ---------- */
const FALL_2026_START = "2026-08-24";

const formatScheduleDate = (date) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(date);

const buildWeekDates = (startDate, count = 15) => {
  if (!startDate) return [];
  const start = new Date(`${startDate}T12:00:00`);
  if (Number.isNaN(start.getTime())) return [];

  return Array.from({ length: count }, (_, i) => {
    const from = new Date(start);
    from.setDate(start.getDate() + i * 7);
    const to = new Date(from);
    to.setDate(from.getDate() + 4);
    return `${formatScheduleDate(from)} to ${formatScheduleDate(to)}`;
  });
};

/* ---------- weight helpers ---------- */
const parseWeight = (s) => {
  // Strip "%", whitespace, letters so "20%", " 20 ", "20 percent" → 20
  const n = parseFloat(String(s ?? "").replace(/[^\d.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const fmtWeight = (n) => {
  // Round to 2 decimals, drop trailing zeros:
  // 100.00000000000001 → "100", 33.333 → "33.33"
  const r = Math.round(n * 100) / 100;
  return (Object.is(r, -0) ? 0 : r).toString();
};

/* ---------- initial state ---------- */


const MEETING_PATTERNS = [
  { value: "MWF", label: "Monday-Wednesday-Friday (MWF)" },
  { value: "MW", label: "Monday-Wednesday (MW)" },
  { value: "TR", label: "Tuesday-Thursday (TR)" },
  { value: "custom", label: "Custom" },
];

// Builds a fresh blank draft. Returning a new object each time keeps the
// initial state and every reset independent of each other.
const createBlank = () => ({
  code: "", title: "", crn: "", section: "", term: "Fall 2026", modality: "In person",
  credits: "3", meetingPattern: "", meeting: "", meetingTime: "",
  location: "", exlocation: "", dept: "", prereq: "",
  instructor: "", email: "", phone: "", office: "", hours: "", address: "",
  subjectLine: "", responseTime: "48 hours on business days",
  description: "", welcome: "", customDescriptions: [],
  showPrimer: true, outcomes: [""],
  texts: "", costNote: "", tech: "",
  materials: { provided: false, hardcopy: false, online: false, acquire: "" },
  extraMaterials: [],
  items: [{ name: "", weight: "", points: "", due: "", desc: "", slos: [] }],
  scale: "A 90 to 100  ·  B 80 to 89  ·  C 70 to 79  ·  D 60 to 69  ·  F below 60",
  attendance: "", late: "", lateSample: "", lateAdditional: [], participation: "",
  aiTier: "mixed", aiCustom: "", profNote: "", customPolicies: [],
  inc: { integrity: true, accessibility: true, support: true, crisis: true, changes: true },
  meetDays: [], // 1 = Monday ... 6 = Saturday
  scheduleType: "weekly",
  semesterStart: FALL_2026_START,
  weeks: [{ label: "Week 1", dates: "", topics: "", due: "" }],
  calNote: true,
  hasLab: false,
  lab: {
    crn: "", meeting: "", location: "", instructor: "",
    description: "", gradeNote: "", attendance: "",
    safety: "", supplies: "", makeup: "",
  },
});

// Read-only baseline used to tell whether the draft has been edited.
const blank = createBlank();

/* ---------- small UI atoms ---------- */

const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const trimEnds = (s) => s.replace(/^[._-]+|[._-]+$/g, "");

const sanitizePart = (s) => {
  const out = trimEnds(
    trimEnds(
      String(s ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")   // é -> e
        .replace(/[^A-Za-z0-9._-]/g, "_")  // whitelist
        .replace(/_+/g, "_")               // collapse runs
    ).slice(0, 60)                         // length cap
  );
  return RESERVED.test(out) ? `${out}_` : out;
};

/**
 * Normalizes a course code string to match the course catalog JSON keys.
 * Example: "csci 325", "CSCI-325", or "  Csci325 " → "CSCI325"
 */
const normalizeCourseKey = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/[^A-Za-z0-9]/g, "") // Strip spaces, hyphens, and punctuation
    .toUpperCase();               // Force to uppercase to match JSON keys
};


/** Renders an uppercase field label and an optional hint. */
const Lbl = ({ children, hint }) => (
  <div className="mb-1">
    <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: UI.slate }}>{children}</span>
    {hint && <span className="ml-2 text-xs" style={{ color: UI.muted }}>{hint}</span>}
  </div>
);

const inputBase = {
  width: "100%", border: `1px solid ${UI.line}`, borderRadius: 4,
  padding: "7px 10px", fontFamily: "Cambria, Georgia, serif",
  fontSize: 14, color: UI.ink, background: UI.paper, outline: "none",
};

/** Renders a controlled single-line text input using the builder's shared styling. */
const T = ({ value, onChange, placeholder, mono, type = "text", onBlur }) => (
  <input type={type} style={{ ...inputBase, fontFamily: mono ? "ui-monospace, monospace" : inputBase.fontFamily }}
    value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
);

/** Renders a controlled multi-line text input using the builder's shared styling. */
const A = ({ value, onChange, placeholder, rows = 4, onBlur }) => (
  <textarea style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }} rows={rows}
    value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
);

/** Groups a label, hint, and form control into one consistent field. */
const Field = ({ label, hint, children }) => (
  <div className="mb-4"><Lbl hint={hint}>{label}</Lbl>{children}</div>
);

/** Displays instructional text without adding it to the exported syllabus. */
const Note = ({ children }) => (
  <div className="flex gap-2 p-3 mb-4 rounded text-sm" style={{ background: UI.tint, color: UI.slate, lineHeight: 1.55 }}>
    <Info size={15} style={{ color: C.navy, flexShrink: 0, marginTop: 2 }} />
    <div>{children}</div>
  </div>
);

/* ============================================================ */

/**
 * Builds the syllabus editor, live preview, readiness checklist, and export actions.
 * The component keeps all draft data in local React state and passes that state to
 * the document builder so the preview and downloaded files always match.
 */
export default function SyllabusBuilder() {
  const [d, setD] = useState(createBlank);

  const [catalog, setCatalog] = useState({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  useEffect(() => {
    fetch("/utm_course_catalog_26_27.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load catalog asset: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCatalog(data);
        setCatalogLoading(false);
      })
      .catch((error) => {
        console.error("Course catalog fetch error:", error);
        setCatalogError(error.message);
        setCatalogLoading(false);
      });
  }, []); 

  // Tracks the last normalized catalog key that was automatically populated
  const [lastAutofilledKey, setLastAutofilledKey] = useState("");

  // Handles course code changes, lookups, and clean formatting safely
  const handleCourseCodeChange = (inputValue) => {
    const cleanedKey = normalizeCourseKey(inputValue);

    if (catalog && catalog[cleanedKey]) {
      const course = catalog[cleanedKey];

      // 1. Format helper: Enforce standard "POSC 322" space layout rules
      let formattedCode = inputValue;
      const match = cleanedKey.match(/^([A-Z]{4})(\d{3,4}.*)$/);
      if (match) {
        formattedCode = `${match[1]} ${match[2]}`; // Constructs clean "POSC 322" layout
      }

      setD((prev) => {
        const isDefaultCredits = prev.credits === "3";

        // Safety switch: Drops guards temporarily if changing courses entirely
        const isSwitchingCourse = lastAutofilledKey && lastAutofilledKey !== cleanedKey;

        return {
          ...prev,
          code: formattedCode,

          // Overwrite if field is empty, matching baseline templates, or switching courses completely
          title: (!prev.title.trim() || isSwitchingCourse) ? (course.courseTitle || "") : prev.title,
          description: (!prev.description.trim() || isSwitchingCourse) ? (course.description || "") : prev.description,
          prereq: (!prev.prereq.trim() || isSwitchingCourse) ? (course.prerequisites || "") : prev.prereq,
          credits: (!prev.credits.trim() || isDefaultCredits || isSwitchingCourse) ? (course.creditHours || "3") : prev.credits
          // Department is safely omitted here so the manual dropdown menu remains completely in control
        };
      });

      setLastAutofilledKey(cleanedKey);

    } else {
      // If no catalog entry is found yet, update the text box as they type normally
      setD((prev) => ({ ...prev, code: inputValue }));
    }

    // Keep your existing auto-scroll preview window functional
    setTimeout(() => scrollPreviewTo(SECTION_FOR_TAB[tab]), 0);
  };


  // adds a warning before the user leaves the page changes will not be saved.
  const hasUnsavedChanges = JSON.stringify(d) !== JSON.stringify(blank);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);
  const [tab, setTab] = useState(0);
  const [theme,setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [weekCount, setWeekCount] = useState("15");
  const [weekCountWarning, setWeekCountWarning] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const frameRef = useRef(null);
  const previewRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!previewFullscreen) return;
    const onKeyDown = (event) => { if (event.key === "Escape") setPreviewFullscreen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewFullscreen]);

  // Which syllabus heading each editor tab and each repeated section maps to.
  const SECTION_FOR_TAB = [
    "COURSE INFORMATION", "COURSE INFORMATION", "WELCOME TO THIS COURSE",
    "STUDENT LEARNING OUTCOMES", "REQUIRED MATERIALS", "ASSESSMENT AND GRADING",
    "COURSE POLICIES", "UNIVERSITY POLICIES AND STUDENT SUPPORT", "COURSE SCHEDULE",
    "LABORATORY COMPONENT",
  ];
  const SECTION_FOR_ITEM = {
    weeks: "COURSE SCHEDULE",
    items: "ASSESSMENT AND GRADING",
    outcomes: "STUDENT LEARNING OUTCOMES",
  };

  // The element that actually scrolls the preview: the page itself in normal
  // mode, or its wrapper in fullscreen, where the page is allowed to grow.
  const previewScroller = () => {
    let el = previewRef.current;
    while (el && el !== document.body && el.scrollHeight <= el.clientHeight + 1) {
      el = el.parentElement;
    }
    return el && el !== document.body ? el : null;
  };

  // Scroll the preview to the heading for the section being edited, so the user
  // sees the change without hunting for it. Works in both normal and fullscreen
  // mode, where the scrolling element is the wrapper around the page.
  const scrollPreviewTo = (sectionName) => {
    const paper = previewRef.current;
    if (!sectionName || !paper) return;
    const heading = [...paper.querySelectorAll("h2, h3")]
      .find((h) => h.innerText.trim() === sectionName);
    if (!heading) return;
    const scroller = previewScroller();
    if (!scroller) return;
    const top = heading.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      + scroller.scrollTop - 60;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const set = (k, v) => {
    setD((p) => ({ ...p, [k]: v }));
    setTimeout(() => scrollPreviewTo(SECTION_FOR_TAB[tab]), 0);
  };
  // Update one property inside a repeated array item, such as an assignment or week.
  const setDeep = (k, i, key, v) => {
    setD((p) => { const a = [...p[k]]; a[i] = { ...a[i], [key]: v }; return { ...p, [k]: a }; });
    setTimeout(() => scrollPreviewTo(SECTION_FOR_ITEM[k]), 0);
  };
  // Add or remove one item from a repeated syllabus section.
  const push = (k, obj) => setD((p) => ({ ...p, [k]: [...p[k], obj] }));
  const entryHasContent = (entry) => typeof entry === "string"
    ? entry.trim().length > 0
    : Object.values(entry).some((value) => Array.isArray(value) ? value.length > 0 : String(value ?? "").trim().length > 0);

  // Remove entry i from section k. Deleting an outcome also reindexes the
  // assignment links that pointed at it, so no link is left dangling.
  const applyDrop = (k, i) => setD((p) => {
    const next = { ...p, [k]: p[k].filter((_, j) => j !== i) };
    if (k === "outcomes" && p.outcomes[i].trim()) {
      const gone = p.outcomes.slice(0, i).filter((o) => o.trim()).length;
      next.items = p.items.map((x) => ({
        ...x,
        slos: x.slos.filter((z) => z !== gone).map((z) => (z > gone ? z - 1 : z)),
      }));
    }
    return next;
  });

  const drop = (k, i) => {
    if (entryHasContent(d[k][i])) {
      setPendingDelete({ k, i });
      return;
    }
    applyDrop(k, i);
  };

  const confirmDrop = () => {
    if (!pendingDelete) return;
    const { k, i } = pendingDelete;
    applyDrop(k, i);
    setPendingDelete(null);
  };

  useEffect(() => {
    if (!pendingDelete) return undefined;
    const closeOnEscape = (e) => { if (e.key === "Escape") setPendingDelete(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [pendingDelete]);

  const setLab = (k, v) => setD((p) => ({ ...p, lab: { ...p.lab, [k]: v } }));

  function calculateWeightTotal(items) {
    const total = items.reduce((sum, item) => sum + parseWeight(item.weight), 0);
    return Math.round(total * 100) / 100;
  }

  const autofillScheduleDates = () => {
    const dates = buildWeekDates(d.semesterStart, Math.max(15, d.weeks.length));
    if (!dates.length) return;
    setD((p) => ({
      ...p,
      weeks: p.weeks.map((w, i) => ({
        ...w,
        label: w.label || `Week ${i + 1}`,
        dates: dates[i] || w.dates,
      })),
    }));
  };

  const buildSemesterSchedule = () => {
    const dates = buildWeekDates(d.semesterStart, 15);
    if (!dates.length) return;
    setD((p) => ({
      ...p,
      weeks: Array.from({ length: 15 }, (_, i) => ({
        ...(p.weeks[i] || {}),
        label: p.weeks[i]?.label || `Week ${i + 1}`,
        dates: dates[i],
        topics: p.weeks[i]?.topics || "",
        due: p.weeks[i]?.due || "",
      })),
    }));
  };

  const weightTotal = useMemo(
    () => calculateWeightTotal(d.items), [d.items]);

  const realOutcomes = d.outcomes.filter((o) => o.trim());
  const mappedSlos = new Set(d.items.flatMap((x) => x.slos));
  const unmapped = realOutcomes.map((_, i) => i).filter((i) => !mappedSlos.has(i));

  const aiText = d.aiTier === "custom" ? d.aiCustom : AI_POLICIES[d.aiTier].text;
  const lateText = [d.late, ...d.lateAdditional.map((policy) => policy.text)]
    .filter((text) => text.trim()).join("\n\n");

  // With meeting days picked, week rows and their dates come from the registrar
  // calendar; topics and due dates still come from d.weeks by position.
  const cal = ACADEMIC_CALENDARS[d.term];
  const autoWeeks = useMemo(() => buildWeeks(cal, d.meetDays), [cal, d.meetDays]);
  // Modular schedules are hand-built, so the registrar calendar drives weekly ones only.
  const auto = d.scheduleType !== "modular" && autoWeeks.length > 0;
  const schedRows = auto
    ? autoWeeks.map((w, i) => ({ ...w, topics: d.weeks[i]?.topics || "", due: d.weeks[i]?.due || "" }))
    : d.weeks.map((w) => ({ ...w, off: [] }));
  const setWeek = (i, key, v) => setD((p) => {
    const a = [...p.weeks];
    while (a.length <= i) a.push({ label: `Week ${a.length + 1}`, dates: "", topics: "", due: "" });
    a[i] = { ...a[i], [key]: v };
    return { ...p, weeks: a };
  });
  const toggleDay = (n) => set("meetDays",
    d.meetDays.includes(n) ? d.meetDays.filter((x) => x !== n) : [...d.meetDays, n].sort());

  // Week numbers (1-based) whose topics field is empty. Drives both the
  // readiness check below and the pre-export confirm.
  const missingWeeks = schedRows
    .map((w, i) => ({ w, n: i + 1 }))
    .filter(({ w }) => !w.topics?.trim())
    .map(({ n }) => n);

  // A full UTM semester is 15 weeks. The schedule is "complete" when there are
  // at least 15 rows and each of the first 15 has its topics filled in.
  const FULL_TERM = 15;
  const blankInTerm = missingWeeks.filter((n) => n <= FULL_TERM);
  const fifteenWeeksReady = schedRows.length >= FULL_TERM && blankInTerm.length === 0;
  const fifteenWeeksLabel = fifteenWeeksReady
    ? `All ${FULL_TERM} weeks are filled in`
    : schedRows.length < FULL_TERM
      ? `Schedule has ${schedRows.length} of ${FULL_TERM} weeks`
      : `Week${blankInTerm.length > 1 ? "s" : ""} ${blankInTerm.join(", ")} missing topics (all ${FULL_TERM} weeks need topics)`;

  const selectedMeetingPattern = MEETING_PATTERNS.find(
    (pattern) => pattern.value === d.meetingPattern
  );
  const meetingDays = d.meetingPattern === "custom"
    ? String(d.meeting || "").trim()
    : selectedMeetingPattern?.label || "";
  const meetingDisplay = [meetingDays, String(d.meetingTime || "").trim()]
   .filter(Boolean)
   .join(", ") || String(d.meeting || "").trim();

  /* ---------- readiness: report whether required syllabus content is complete ---------- */
  const hasText = (value) => typeof value === "string" && value.trim().length > 0;
  const checks = [
    ["Course code, title, term, and credit hours", [d.code, d.title, d.term, d.credits].every(hasText)],
    ["Meeting time and modality stated", hasText(d.modality) && (d.modality.startsWith("Online") || hasText(meetingDisplay))],
    ["Instructor name and email", hasText(d.instructor) && hasText(d.email)],
    ["Office hours and how to reach you", hasText(d.hours)],
    ["Course description", hasText(d.description)],
    ["Why this course matters, in your voice", hasText(d.welcome)],
    ["At least three learning outcomes", realOutcomes.length >= 3],
    ["Every outcome tied to an assessment", realOutcomes.length > 0 && unmapped.length === 0],
    ["Required materials listed", hasText(d.texts) || d.materials.provided || d.materials.hardcopy || d.materials.online || hasText(d.materials.acquire)],
    ["Assessment weights total 100 percent", Math.abs(weightTotal - 100) < 0.01],
    ["Grading scale", hasText(d.scale)],
    ["Attendance policy", hasText(d.attendance)],
    ["Late work and make-up policy", hasText(lateText)],
    ["AI policy (required by UTM policy)", hasText(aiText)],
    ["Accessibility statement included", d.inc.accessibility],
    ["Academic integrity included", d.inc.integrity],
    ["Crisis resources included", d.inc.crisis],
    ["Schedule has at least one entry", auto || d.weeks.some((w) => hasText(w.topics) || hasText(w.dates))],
    [missingWeeks.length === 0
      ? "Every week in the schedule has topics"
      : `Topics missing for week${missingWeeks.length > 1 ? "s" : ""} ${missingWeeks.join(", ")}`,
      missingWeeks.length === 0],
    [fifteenWeeksLabel, fifteenWeeksReady],
    ...(d.hasLab ? [
      ["Lab meeting time and location", hasText(d.lab.meeting) && hasText(d.lab.location)],
      ["How the lab counts toward the course grade", hasText(d.lab.gradeNote)],
      ["Lab safety expectations stated", hasText(d.lab.safety)],
    ] : []),
  ];
  const passed = checks.filter((c) => c[1]).length;

  /* ---------- document builder: create the HTML shared by preview and exports ---------- */

  const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const para = (s = "") => esc(s).split(/\n{2,}/).map((p) =>
    `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");

  const docBody = useMemo(() => {
    const h = [];
    const sec = (t) => h.push(`<h2>${esc(t)}</h2>`);

    h.push(`<table class="hdr"><tr>
      <td class="hdr-l"><img src="${LOGO}" alt="The University of Tennessee at Martin" width="230"/></td>
      <td class="hdr-r"><div class="ct">${esc(d.code || "COURSE 000")}</div>
      <h1 class="tt">${esc(d.title || "Course Title")}</h1>
      <div class="st">${esc(d.term)}${d.modality ? " &nbsp;|&nbsp; " + esc(d.modality) : ""}${d.dept ? " &nbsp;|&nbsp; " + esc(d.dept) : ""}</div></td></tr></table>`);

    // Course facts
    const facts = [
      ["Course", `${d.code} ${d.title}`.trim()],
      ["CRN", d.crn],
      ["Section", d.section],
      ["Term", d.term],
      ["Delivery", d.modality],
      ["Credit hours", d.credits],
      ["Meeting time", meetingDisplay],
      ["Location", d.location],
      ["Extra Location", d.exlocation],
      ["Prerequisites", d.prereq],
      ["Instructor", d.instructor],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Office", d.office],
      ["Office hours", d.hours],
    ].filter((r) => r[1] && String(r[1]).trim());
    if (facts.length) {
      sec("Course Information");
      h.push(`<table class="grid">${facts.map((r) =>
        `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`);
    }

    if (d.welcome) { sec("Welcome to This Course"); h.push(para(d.welcome)); }
    if (d.description) { sec("Course Description"); h.push(para(d.description)); }
    (d.customDescriptions || []).filter((item) => item.title.trim() || item.description.trim()).forEach((item) => {
      sec(item.title.trim() || "Custom Course Description");
      if (item.description.trim()) h.push(para(item.description));
    });

    if (realOutcomes.length || d.showPrimer) {
      sec("Student Learning Outcomes");
      if (d.showPrimer) h.push(`<div class="primer"><div class="primer-h">For the instructor: what an SLO is and why it is here</div>${para(SLO_PRIMER)}</div>`);
      if (realOutcomes.length) {
        h.push(`<p>By the end of this course, you should be able to:</p><ol>${realOutcomes.map((o) =>
          `<li>${esc(o)}</li>`).join("")}</ol>`);
      }
    }

    const m = d.materials;
    const hasAccess = m.provided || m.hardcopy || m.online || m.acquire;
    const customMaterials = d.extraMaterials.filter(
      (material) => material.title.trim() || material.description.trim()
    );
    if (d.texts || d.costNote || d.tech || hasAccess || customMaterials.length) {
      sec("Required Materials");
      if (d.texts) h.push(para(d.texts));
      if (d.costNote) h.push(`<p class="soft">${esc(d.costNote)}</p>`);
      if (hasAccess) {
        const lines = [];
        if (m.provided) lines.push("These materials will be provided to you at no additional cost.");
        const fmt = m.hardcopy && m.online ? "both hardcopy and online"
          : m.hardcopy ? "hardcopy" : m.online ? "online" : "";
        if (fmt) lines.push(`Format: available in ${fmt}.`);
        if (m.acquire) lines.push(`Where to acquire: ${m.acquire}`);
        h.push(`<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`);
      }
      if (d.tech) { h.push(`<h3>Technology you will need</h3>`); h.push(para(d.tech)); }
      customMaterials.forEach((material) => {
        if (material.title) h.push(`<h3>${esc(material.title)}</h3>`);
        if (material.description) h.push(para(material.description));
      });
    }

    const live = d.items.filter((x) => x.name);
    if (live.length) {
      const hasDueDates = live.some((x) => x.due?.trim());
      sec("Assessment and Grading");
      h.push(`<table class="grid"><tr><th>Assignment</th><th class="w">Weight</th>${hasDueDates ? '<th class="assignment-due">Due date</th>' : ""}<th>What it is</th></tr>${
        live.map((x) => `<tr><td><strong>${esc(x.name)}</strong>${
          x.slos.length ? `<div class="tag">Outcome${x.slos.length > 1 ? "s" : ""} ${x.slos.map((i) => i + 1).join(", ")}</div>` : ""
        }</td><td class="w">${fmtWeight(parseWeight(x.weight))}%</td>${hasDueDates ? `<td class="assignment-due">${esc(x.due || "")}</td>` : ""}<td>${esc(x.desc)}</td></tr>`).join("")
      }<tr class="tot"><td>Total</td><td class="w">${fmtWeight(weightTotal)}%</td>${hasDueDates ? "<td></td>" : ""}<td></td></tr></table>`);
      if (d.scale) { h.push(`<h3>Grading scale</h3>`); h.push(para(d.scale)); }
    }

        if (d.hasLab) {
      const L = d.lab;
      sec("Laboratory Component");
      const lf = [
        ["Lab section / CRN", L.crn],
        ["Lab meeting time", L.meeting],
        ["Lab location", L.location],
        ["Lab instructor", L.instructor],
      ].filter((r) => r[1] && String(r[1]).trim());
      if (lf.length) h.push(`<table class="grid">${lf.map((r) =>
        `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`);
      if (L.description) h.push(para(L.description));
      [
        ["How the Lab Counts Toward Your Grade", L.gradeNote],
        ["Lab Attendance", L.attendance],
        ["Lab Safety", L.safety],
        ["Supplies and Protective Equipment", L.supplies],
        ["Missed Labs and Make-Up", L.makeup],
      ].forEach(([t, b]) => {
        if (b && b.trim()) { h.push(`<h3>${esc(t)}</h3>`); h.push(para(b)); }
      });
    }

    const pol = [];
    if (d.attendance) pol.push(["Attendance and Participation", d.attendance]);
    if (d.participation) pol.push(["What Engagement Looks Like Here", d.participation]);
    if (lateText) pol.push(["Late Work and Make-Up Policy", lateText]);
    if (d.subjectLine || d.responseTime || d.address)
      pol.push(["Reaching Me", [
        d.subjectLine && `Use this subject line on every email: ${d.subjectLine}`,
        d.responseTime && `I respond to email within ${d.responseTime}.`,
        d.address && `You can address me as ${d.address}.`,
      ].filter(Boolean).join("\n")]);
    if (aiText.trim()) pol.push(["Artificial Intelligence Policy", aiText]);
      const customPolicies = d.customPolicies.filter((policy) => policy.title.trim() || policy.text.trim());
      if (pol.length || customPolicies.length) {
      sec("Course Policies");
      pol.forEach(([t, b]) => { h.push(`<h3>${esc(t)}</h3>`); h.push(para(b)); });
      if (d.profNote) h.push(`<div class="pnote"><strong>A note from your professor.</strong> ${esc(d.profNote)}</div>`);
        customPolicies.forEach((policy) => {
        if (policy.title.trim()) h.push(`<h3>${esc(policy.title)}</h3>`);
        if (policy.text.trim()) h.push(para(policy.text));
      });
    }

    const uni = Object.keys(LOCKED).filter((k) => d.inc[k]);
    if (uni.length) {
      sec("University Policies and Student Support");
      uni.forEach((k) => { h.push(`<h3>${esc(LOCKED[k].title)}</h3>`); h.push(para(LOCKED[k].text)); });
    }

    const wk = schedRows.filter((w) => w.label || w.topics || w.dates);
    if (wk.length) {
      sec("Course Schedule");
      h.push(`<table class="grid"><tr><th class="wk">${d.scheduleType === "modular" ? "Module" : "Week"}</th><th>Topics and Readings</th><th class="due">Due</th></tr>${
        wk.map((w) => `<tr><td class="wk"><strong>${esc(w.label)}</strong>${w.dates ? `<br/><span class="soft">${esc(w.dates)}</span>` : ""}</td><td>${
          w.off.map((o) => `<div class="off">${esc(o)}</div>`).join("")}${esc(w.topics).replace(/\n/g, "<br/>")}</td><td class="due">${esc(w.due).replace(/\n/g, "<br/>")}</td></tr>`).join("")
      }</table>`);
    }

    if (d.calNote && d.term === "Fall 2026") {
      sec("Fall 2026 Dates You Should Know");
      h.push(`<table class="grid">${FALL_2026.map((r) =>
        `<tr><th class="wk">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>
        <p class="soft">Registrar's calendar, subject to change. Confirm at utm.edu/academics/academic-calendar/</p>`);
    }

    return h.join("");
  }, [d, weightTotal, realOutcomes, aiText, meetingDisplay, schedRows]);

  const DOC_CSS = `
    body{font-family:Cambria,Georgia,serif;font-size:11pt;line-height:1.5;color:#1a1a1a;margin:0}
    .page{padding:0}
    h2{font-family:Cambria,Georgia,serif;font-size:14pt;color:${C.navy};margin:22px 0 8px;
       border-bottom:2px solid ${C.orange};padding-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
    h3{font-family:Cambria,Georgia,serif;font-size:11.5pt;color:${C.navy};margin:14px 0 4px}
    p{margin:0 0 9px}
    ol,ul{margin:0 0 10px 20px;padding:0} li{margin-bottom:5px}
    .soft{color:#5A6A80;font-size:10pt}
    table.hdr{width:100%;border-collapse:collapse;margin-bottom:6px;border-bottom:3px solid ${C.navy}}
    .hdr td{vertical-align:bottom;padding:0 0 10px}
    .hdr-l{width:245px}
    .hdr-r{text-align:right}
    .ct{font-size:10pt;letter-spacing:2px;color:${C.orange};font-weight:bold}
    .tt{font-size:19pt;color:${C.navy};line-height:1.15;font-weight:bold;margin:0}
    .st{font-size:10pt;color:#5A6A80;margin-top:3px}
    table.grid{width:100%;border-collapse:collapse;margin:6px 0 12px;font-size:10.5pt}
    .grid th,.grid td{border:1px solid ${C.line};padding:6px 9px;text-align:left;vertical-align:top}
    .grid th{background:#EEF2F7;color:${C.navy};font-weight:bold;width:auto}
    .grid td .tag{font-size:8.5pt;color:${C.orange};font-weight:bold;margin-top:3px}
    .grid .w{width:70px;text-align:right}
    .grid .wk{width:110px}
    .grid .due{width:150px}
    .grid .assignment-due{width:90px}
    .grid tr.tot td{background:#EEF2F7;font-weight:bold}
    .primer{border-left:4px solid ${C.orange};background:#FAFBFD;padding:10px 14px;margin:8px 0 14px;font-size:10pt}
    .primer-h{font-weight:bold;color:${C.navy};margin-bottom:6px}
    .pnote{border:1px solid ${C.orange};background:#FFF8F0;padding:10px 14px;margin:10px 0;font-size:10.5pt}
    .off{color:${C.warn};font-weight:bold;font-size:10pt;margin-bottom:3px}
  `;

  const fullHtml = () =>
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head>
    <meta charset="utf-8"/><title>${esc(pdfFilename())}</title>
     <style>@page{size:8.5in 11in;margin:0.8in}${DOC_CSS}</style></head>
     <body><div class="page">${docBody}</div></body></html>`;

  /** Downloads a generated browser Blob without sending it to a server. */
  const dl = (blob, name) => {
    const u = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
  };
  const fname = (ext) => `${sanitizePart(d.code) || "Syllabus"}_${sanitizePart(d.term) || "Term"}.${ext}`;
  const pdfFilename = () => `Syllabus_${sanitizePart(d.term) || "Term"}`;

  /** Downloads the current syllabus as an editable Word-compatible HTML document. */
  const exportWord = () => dl(new Blob(["\ufeff" + fullHtml()], { type: "application/msword" }), fname("doc"));
  const clearForm = () => {
    if (!window.confirm("Clear the entire syllabus and start over? This cannot be undone. Export your syllabus first if you want to keep a copy.")) return;
    setD(createBlank());
    setTab(0);
    const scroller = previewScroller();
    if (scroller) scroller.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Put the cursor back in the first field so the user can start over typing.
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector("input")?.focus({ preventScroll: true });
    });
  };
  /** Opens the browser print dialog with the current syllabus formatted for PDF output. */  const exportPdf = () => {
    const f = frameRef.current; if (!f) return;
    const doc = f.contentWindow.document;
    doc.open(); doc.write(fullHtml()); doc.close();
    doc.title = pdfFilename();
    setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); }, 250);
  };

  // Warn about weeks with no topics before exporting; run the export only if
  // the schedule is complete or the user chooses to proceed anyway.
  const confirmThenExport = (exportFn) => {
    if (missingWeeks.length > 0) {
      const ok = window.confirm(
        `Your schedule is missing topics for week${missingWeeks.length > 1 ? "s" : ""} ${missingWeeks.join(", ")}. Export anyway?`
      );
      if (!ok) return;
    }
    exportFn();
  };

  /* ---------- sections ---------- */
  const TABS = [
    { n: "Course", i: BookOpen }, { n: "Instructor", i: User }, { n: "Welcome", i: MessageSquare },
    { n: "Outcomes", i: Target }, { n: "Materials", i: Library }, { n: "Grading", i: Scale },
    { n: "Policies", i: Gavel }, { n: "University", i: ShieldCheck }, { n: "Schedule", i: CalendarDays },
    {n: "Labs", i: FlaskConical},{ n: "Export", i: FileDown },
  ];

  /** Renders a consistently styled action button with an optional icon. */
  const Btn = ({ onClick, children, icon: I, primary }) => (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold"
      style={{ background: primary ? C.navy : UI.paper, color: primary ? "#fff" : UI.navy,
        border: `1px solid ${primary ? C.navy : C.line}`, cursor: "pointer" }}>
      {I && <I size={15} />}{children}
    </button>
  );

  /* ---------- editor layout: navigation, form controls, and matching live preview ---------- */
  return (
    <div style={{ fontFamily: "Cambria, Georgia, serif", background: UI.wash, minHeight: "100vh" }}>
      <iframe ref={frameRef} title="print" style={{ position: "fixed", width: 0, height: 0, border: 0, left: -9999 }} />
      {pendingDelete && (
        <div role="presentation" onMouseDown={() => setPendingDelete(null)} style={{ position: "fixed", inset: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(11,34,64,.38)" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" onMouseDown={(e) => e.stopPropagation()}
            style={{ width: "min(100%, 420px)", background: "#fff", borderRadius: 4, padding: 24, boxShadow: "0 12px 36px rgba(11,34,64,.24)" }}>
            <div id="delete-dialog-title" style={{ color: C.navy, fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Delete this entry?</div>
            <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
              This {({ outcomes: "learning outcome", items: "assignment", weeks: "schedule entry" }[pendingDelete.k] || "entry")} contains information. Are you sure you want to delete it?
            </div>
            <div className="flex justify-end gap-2">
              <Btn onClick={() => setPendingDelete(null)}>Cancel</Btn>
              <Btn onClick={confirmDrop} primary>Delete</Btn>
            </div>
          </div>
        </div>
      )}

      {/* masthead */}
      <div style={{ background: C.navy, borderBottom: `4px solid ${C.orange}` }} className="px-5 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <UtmMark style={{ width: 114 }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,.3)", paddingLeft: 16 }}>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: "bold", lineHeight: 1.1 }}>Syllabus Builder</div>
              <div style={{ color: C.orange, fontSize: 11, letterSpacing: 1 }}>CENTER FOR TEACHING AND LEARNING</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ color: "#B9C6D8", fontSize: 12, marginRight: 6 }}>{passed} of {checks.length} complete</div>
            <div style={{ width: 120, height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3 }}>
              <div style={{ width: `${(passed / checks.length) * 100}%`, height: "100%", background: C.orange, borderRadius: 3, transition: "width .3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap" style={{ alignItems: "flex-start" }}>
        {/* left rail */}
        <div style={{ width: 150, background: UI.paper, borderRight: `1px solid ${UI.line}`, minHeight: "calc(100vh - 62px)" }}>
          {TABS.map((t, i) => {
            const on = tab === i; const I = t.i;
            return (
              <button key={t.n} onClick={() => setTab(i)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left"
                style={{ background: on ? UI.tint : "transparent", color: on ? UI.navy : UI.slate,
                  borderLeft: `3px solid ${on ? C.orange : "transparent"}`, fontWeight: on ? "bold" : "normal", cursor: "pointer" }}>
                <I size={15} />{t.n}
              </button>
            );
          })}
          <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{margin: 12, padding: "6px 10px", borderRadius: 4, cursor: "pointer",
            background: UI.paper, color: UI.ink, border: '1px solid ${UI.line}'}}>
          {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
        </div>

        {/* form */}
        <div ref={formRef} className="p-5" style={{ flex: "1 1 420px", minWidth: 340, maxWidth: 620 }}>
          {tab === 0 && (<>
            <H>Course</H>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 150px" }}>
                <Field label="Course code" hint="POSC 322">
                  <T
                    value={d.code}
                    onChange={handleCourseCodeChange} // Connected to your safe lookup handler
                    placeholder="POSC 322"
                  />

                  {/* Autofill Match Indicator Banner */}
                  {d.code && catalog && catalog[normalizeCourseKey(d.code)] && (
                    <div
                      className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        background: UI.goodBg || "#E8F5E9",
                        color: UI.good || "#1E7A46",
                        border: `1px solid ${UI.line || "#D8DEE7"}`
                      }}
                    >
                      <Check size={12} />
                      Matched catalog data loaded!
                    </div>
                  )}
                </Field>
              </div>
              <div style={{ flex: "2 1 240px" }}>
                <Field label="Course title">
                  <T value={d.title} onChange={(v) => set("title", v)} placeholder="American Foreign Policy" />
                </Field>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 130px" }}><Field label="CRN" hint="the 5-digit registration number"><T value={d.crn} onChange={(v) => set("crn", v)} placeholder="12345" /></Field></div>
              <div style={{ flex: "1 1 130px" }}><Field label="Section"><T value={d.section} onChange={(v) => set("section", v)} placeholder="001" /></Field></div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 130px" }}><Field label="Term">
                <select style={inputBase} value={d.term} onChange={(e) => set("term", e.target.value)}>
                  {[...new Set([...Object.keys(ACADEMIC_CALENDARS), d.term])].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field></div>
              <div style={{ flex: "1 1 130px" }}><Field label="Credit hours"><T value={d.credits} onChange={(v) => set("credits", v)} /></Field></div>
            </div>
            <Field label="Delivery" hint="students read this before they register">
              <select style={inputBase} value={d.modality} onChange={(e) => set("modality", e.target.value)}>
                {["In person", "Hybrid", "Online synchronous", "Online asynchronous", "Dual Enrollment", "Internship"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
                        <Field label="Meeting days" hint="leave blank if fully asynchronous">
              <select
                style={inputBase}
                value={d.meetingPattern || ""}
                onChange={(e) => set("meetingPattern", e.target.value)}
              >
                <option value="">Select meeting days</option>
                {MEETING_PATTERNS.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>{pattern.label}</option>
                ))}
              </select>
            </Field>
            {d.meetingPattern === "custom" && (
              <Field label="Custom meeting days">
                <T
                  value={d.meeting}
                  onChange={(v) => set("meeting", v)}
                  placeholder="Monday and Thursday"
                />
              </Field>
            )}
            <Field label="Meeting time" hint="leave blank if fully asynchronous">
              <T
                value={d.meetingTime || ""}
                onChange={(v) => set("meetingTime", v)}
                placeholder="9:30 to 10:45 a.m."
              />
            </Field>
            <Field label="Room"><T value={d.location} onChange={(v) => set("location", v)} placeholder="Humanities 407" /></Field>
            <Field label="Other Meeting Room" hint="Only fill this if some classes take place in other room during the week"><T value={d.exlocation} onChange={(v) => set("exlocation", v)} placeholder="Humanities 409 on Fridays" /></Field>
<Field label="Department">
  <select
    style={inputBase}
    value={d.dept}
    onChange={(e) => set("dept", e.target.value)}
  >
    <option value="">Select a department...</option>

    <optgroup label="College of Agriculture and Applied Sciences">
      <option value="Agriculture, Geosciences, and Natural Resources">
        Agriculture, Geosciences, and Natural Resources
      </option>
      <option value="Family and Consumer Sciences">
        Family and Consumer Sciences
      </option>
    </optgroup>

    <optgroup label="College of Business and Global Affairs">
      <option value="Accounting, Finance, Economics, and Political Science">
        Accounting, Finance, Economics, and Political Science
      </option>
      <option value="Management, Marketing, and Information Systems">
        Management, Marketing, and Information Systems
      </option>
    </optgroup>

    <optgroup label="College of Education, Health, and Behavioral Sciences">
      <option value="Behavioral Sciences">
        Behavioral Sciences
      </option>
      <option value="Educational Studies">
        Educational Studies
      </option>
      <option value="Health and Human Performance">
        Health and Human Performance
      </option>
      <option value="Nursing">
        Nursing
      </option>
      <option value="Psychology">
        Psychology
      </option>
    </optgroup>

    <optgroup label="College of Engineering and Natural Sciences">
      <option value="Biological Sciences">
        Biological Sciences
      </option>
      <option value="Chemistry and Physics">
        Chemistry and Physics
      </option>
      <option value="Computer Science">
        Computer Science
      </option>
      <option value="Engineering">
        Engineering
      </option>
      <option value="Mathematics and Statistics">
        Mathematics and Statistics
      </option>
    </optgroup>

    <optgroup label="College of Humanities and Fine Arts">
      <option value="Communications">
        Communications
      </option>
      <option value="English and Modern Foreign Languages">
        English and Modern Foreign Languages
      </option>
      <option value="History and Philosophy">
        History and Philosophy
      </option>
      <option value="Music">
        Music
      </option>
      <option value="Visual and Theatre Arts">
        Visual and Theatre Arts
      </option>
    </optgroup>
  </select>
</Field>
            <Field label="Prerequisites"><T value={d.prereq} onChange={(v) => set("prereq", v)} placeholder="None" /></Field>
          </>)}

          {tab === 1 && (<>
            <H>Instructor</H>
            <Note>Office hours are the single most under-used thing on a syllabus. Students who work shifts or commute from Dresden or Union City often cannot make a fixed midday block. Naming an alternative, even just "email me and we will find a time," changes who walks through the door.</Note>
            <Field label="Your name"><T value={d.instructor} onChange={(v) => set("instructor", v)} placeholder="Dr. Jane Doe" /></Field>
            <Field label="Email"><T value={d.email} onChange={(v) => set("email", v)} onBlur={() => {const username = d.email.trim().split("@")[0]; set("email", username ? `${username}@utm.edu` : "");}} placeholder="jdoe (autofills @utm.edu)" /></Field>
            <Field label="Phone"><T type="tel" value={d.phone} onChange={(v) => set("phone", v)} placeholder="731-555-0123" /></Field>
            <Field label="Office"><T value={d.office} onChange={(v) => set("office", v)} placeholder="Humanities 212" /></Field>
            <Field label="Office hours"><A rows={2} value={d.hours} onChange={(v) => set("hours", v)} placeholder="Monday and Wednesday, 10 a.m. to noon, and by appointment. Email me and we will find a time that works." /></Field>
            <Field label="Email subject line you want" hint="cuts your response time"><T value={d.subjectLine} onChange={(v) => set("subjectLine", v)} placeholder="POSC 322 - [your question]" /></Field>
            <Field label="How students should address you"><T value={d.address} onChange={(v) => set("address", v)} placeholder="Dr. Doe" /></Field>
          </>)}

          {tab === 2 && (<>
            <H>Welcome and Description</H>
            <Note>The description is what the catalog says. The welcome is what you say. Research on student-centered syllabi is consistent that the second one moves how students read everything after it, so it is worth four sentences of your own voice.</Note>
            <Field label="Why this course matters" hint="your voice, not the catalog">
              <A rows={6} value={d.welcome} onChange={(v) => set("welcome", v)}
                placeholder="Foreign policy is not something that happens far away in diplomatic corridors. It shapes the price of the goods you buy, the security of the country you live in, and the reputation the United States carries around the world. This course is built around that reality." />
            </Field>
            <Field label="Course description"><A rows={5} value={d.description} onChange={(v) => set("description", v)} placeholder="Paste the description from the UTM catalog." /></Field>
            <div className="mt-6 mb-2" style={{ color: UI.navy, fontWeight: "bold", fontSize: 14 }}>Custom course descriptions</div>
            {(d.customDescriptions || []).map((item, i) => (
              <div key={i} className="mb-3 p-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                <div className="flex items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Field label="Custom title"><T value={item.title} onChange={(v) => setDeep("customDescriptions", i, "title", v)} placeholder="Course focus, context, or special emphasis" /></Field>
                    <Field label="Description"><A rows={6} value={item.description} onChange={(v) => setDeep("customDescriptions", i, "description", v)} placeholder="Provide a custom course description." /></Field>
                  </div>
                  <button type="button" onClick={() => drop("customDescriptions", i)} aria-label={`Remove custom description ${i + 1}`} title="Remove custom description"
                    className="p-2 rounded" style={{ color: UI.slate, background: "transparent", border: 0, cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <Btn onClick={() => push("customDescriptions", { title: "", description: "" })} icon={Plus}>Add custom course description</Btn>
          </>)}

          {tab === 3 && (<>
            <H>Learning Outcomes</H>
            <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: UI.slate, cursor: "pointer" }}>
              <input type="checkbox" checked={d.showPrimer} onChange={(e) => set("showPrimer", e.target.checked)} style={{ marginTop: 3 }} />
              <span>Include the explainer box in the exported document. It tells a new faculty member what an SLO is, how to test one, and why the Gen Ed outcomes belong here. Uncheck it, or delete the box in Word, once your outcomes are written.</span>
            </label>
            {d.outcomes.map((o, i) => (
              <div key={i} className="flex gap-2 mb-2 items-start">
                <div style={{ width: 22, paddingTop: 8, color: C.orange, fontWeight: "bold", fontSize: 13 }}>{i + 1}</div>
                <div style={{ flex: 1 }}><A rows={2} value={o} onChange={(v) => setD((p) => { const a = [...p.outcomes]; a[i] = v; return { ...p, outcomes: a }; })}
                  placeholder="Students will evaluate ..." /></div>
                <button onClick={() => drop("outcomes", i)} style={{ color: "#9AA5B5", marginTop: 8, cursor: "pointer" }}><Trash2 size={15} /></button>
              </div>
            ))}
            <Btn onClick={() => push("outcomes", "")} icon={Plus}>Add outcome</Btn>
            <div className="mt-6">
              {OUTCOME_LIBRARY.map((g) => (
                <div key={g.group} className="mb-4 p-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                  <div style={{ color: UI.navy, fontWeight: "bold", fontSize: 13 }}>{g.group}</div>
                  <div style={{ color: UI.slate, fontSize: 12, margin: "3px 0 8px" }}>{g.note}</div>
                  {g.items.map((it) => (
                    <div key={it} className="flex gap-2 items-start mb-2">
                         {d.outcomes.includes(it) ? (
                           <span title="Already in your outcomes" style={{ color: C.good, marginTop: 2 }}><Check size={14} /></span>
                         ) : (
                           <button onClick={() => setD((p) => ({ ...p, outcomes: [...p.outcomes.filter((x) => x.trim()), it] }))}
                             style={{ color: C.orange, marginTop: 2, cursor: "pointer" }}><Plus size={14} /></button>
                         )}
                      <div style={{ fontSize: 12.5, color: UI.slate, lineHeight: 1.45 }}>{it}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>)}

          {tab === 4 && (<>
            <H>Materials</H>
            <Field label="Required texts"><A rows={4} value={d.texts} onChange={(v) => set("texts", v)} placeholder="Hastedt, G. P. (2020). American Foreign Policy: Past, Present, and Future (12th ed.). Rowman and Littlefield." /></Field>
            <Field label="Cost note" hint="tell them the real number, and the free path if there is one"><A rows={2} value={d.costNote} onChange={(v) => set("costNote", v)} placeholder="The textbook runs about $60 used. A copy is on reserve at Paul Meek Library. Tell me before the second week if cost is a barrier." /></Field>
            <Field label="Technology and platforms"><A rows={3} value={d.tech} onChange={(v) => set("tech", v)} placeholder="Canvas for all materials and submissions. A phone or laptop microphone is enough for the audio assignments." /></Field>
            <Field label="Access details" hint="answer the questions students always ask: will I be given the book, what format, and where do I get it">
              <label className="flex items-start gap-2 mb-2 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="checkbox" checked={d.materials.provided} onChange={(e) => set("materials", { ...d.materials, provided: e.target.checked })} style={{ marginTop: 3 }} />
                <span>These materials will be provided to you at no additional cost.</span>
              </label>
              <label className="flex items-start gap-2 mb-2 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="checkbox" checked={d.materials.hardcopy} onChange={(e) => set("materials", { ...d.materials, hardcopy: e.target.checked })} style={{ marginTop: 3 }} />
                <span>Available in hardcopy (print).</span>
              </label>
              <label className="flex items-start gap-2 mb-2 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="checkbox" checked={d.materials.online} onChange={(e) => set("materials", { ...d.materials, online: e.target.checked })} style={{ marginTop: 3 }} />
                <span>Available online (digital / e-text).</span>
              </label>
              <A rows={2} value={d.materials.acquire} onChange={(v) => set("materials", { ...d.materials, acquire: v })} placeholder="Where to acquire them: the UTM Bookstore, a copy on reserve at Paul Meek Library, or the publisher link in Canvas." />
            </Field>
            {d.extraMaterials.map((material, i) => (
              <div key={i} className="p-3 mb-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                <div className="flex gap-2 mb-2">
                  <div style={{ flex: 1 }}>
                    <T value={material.title} onChange={(v) => setDeep("extraMaterials", i, "title", v)} placeholder="Custom material heading" />
                  </div>
                  <button onClick={() => drop("extraMaterials", i)} aria-label={`Remove material section ${i + 1}`} style={{ color: UI.muted, cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
                <A rows={3} value={material.description} onChange={(v) => setDeep("extraMaterials", i, "description", v)} placeholder="Describe the additional course material." />
              </div>
            ))}
            <Btn onClick={() => push("extraMaterials", { title: "", description: "" })} icon={Plus}>Add material section</Btn>
          </>)}

          {tab === 5 && (<>
            <H>Assessment and Grading</H>
            <div className="p-3 mb-4 rounded flex items-center gap-2" style={{
              background: Math.abs(weightTotal - 100) < 0.01 ? UI.goodBg : UI.warnBg,
              color: Math.abs(weightTotal - 100) < 0.01 ? UI.good : UI.warn, fontSize: 14, fontWeight: "bold" }}>
              {Math.abs(weightTotal - 100) < 0.01 ? <Check size={16} /> : <AlertTriangle size={16} />}
              Weights total {fmtWeight(weightTotal)}%{Math.abs(weightTotal - 100) < 0.01 ? "" : `, which is ${weightTotal > 100 ? "over" : "under"} by ${fmtWeight(Math.abs(100 - weightTotal))}`}
            </div>
            {d.items.map((x, i) => (
              <div key={i} className="p-3 mb-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                <div className="flex gap-2 mb-2">
                  <div style={{ flex: 3 }}><T value={x.name} onChange={(v) => setDeep("items", i, "name", v)} placeholder="Final paper" /></div>
                  <div style={{ flex: 1 }}><T mono value={x.weight} onChange={(v) => setDeep("items", i, "weight", v)} placeholder="%" /></div>
                  <div style={{ flex: 1 }}><T mono value={x.points} onChange={(v) => setDeep("items", i, "points", v)} placeholder="pts" /></div>
                  <div style={{ flex: 1 }}><T value={x.due} onChange={(v) => setDeep("items", i, "due", v)} placeholder="Due date" /></div>
                  <button onClick={() => drop("items", i)} style={{ color: UI.muted, cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
                <A rows={2} value={x.desc} onChange={(v) => setDeep("items", i, "desc", v)} placeholder="What it is and how long." />
                {realOutcomes.length > 0 && (
                  <div className="mt-2">
                    <div style={{ fontSize: 11, color: C.slate, marginBottom: 4 }}>WHICH OUTCOMES DOES THIS PRODUCE EVIDENCE FOR?</div>
                    <div className="flex flex-wrap gap-1">
                      {realOutcomes.map((_, oi) => {
                        const on = x.slos.includes(oi);
                        return (
                          <button key={oi} onClick={() => setDeep("items", i, "slos", on ? x.slos.filter((z) => z !== oi) : [...x.slos, oi])}
                            style={{ fontSize: 12, padding: "2px 9px", borderRadius: 11, cursor: "pointer",
                              border: `1px solid ${on ? C.orange : C.line}`, background: on ? C.orange : "#fff", color: on ? "#fff" : C.slate }}>
                            {oi + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Btn onClick={() => push("items", { name: "", weight: "", points: "", due: "", desc: "", slos: [] })} icon={Plus}>Add assignment</Btn>
            {unmapped.length > 0 && (
              <div className="mt-4 p-3 rounded flex gap-2" style={{ background: "#FEF6E7", color: C.warn, fontSize: 13 }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>Outcome{unmapped.length > 1 ? "s" : ""} {unmapped.map((i) => i + 1).join(", ")} {unmapped.length > 1 ? "have" : "has"} nothing in the grade breakdown producing evidence for {unmapped.length > 1 ? "them" : "it"}. Either attach an assignment or rewrite the outcome.</div>
              </div>
            )}
            <div className="mt-4"><Field label="Grading scale"><A rows={2} value={d.scale} onChange={(v) => set("scale", v)} /></Field></div>
          </>)}

          {tab === 6 && (<>
            <H>Course Policies</H>
            <Field label="Attendance">
              <select
                style={{ ...inputBase, marginBottom: 8 }}
                value=""
                onChange={(e) => {
                  const text = e.target.value;
                  if (!text) return;
                  if (
                    d.attendance.trim() &&
                    !window.confirm("Replace your current attendance policy?")
                  ) {
                    return;
                  }
                  set("attendance", text);
                }}
              >
                <option value="">Please select a sample attendance policy, then edit it to fit your course</option>
                {[
                  ["Graded",
                    'Attendance in this course means that you will be present for all in-person class meetings. Roll will be called/marked at the beginning of each class period. If you are not present during roll call, it is your responsibility to see the professor after class so that you may be marked tardy; otherwise, you will be marked absent for the day. If you need to miss class for a valid reason (school events, family matters, appointments, etc.) you must notify the professor in advance of your absence, or as near as possible to the class period in the event of emergencies. You need not be detailed, a simple "I am out sick today" will suffice!'
                  ],
                  ["Flexible",
                    `Your attendance is beneficial at all scheduled sessions. It's where new introductions to materials will take place, and group activities will facilitate learning. I understand that life happens and you may not be able to attend every class. Therefore, MWF sections have 3 free absences throughout the semester. T/TH sections have 2 free absences. This includes excused absences.`
                  ],
                  ["Online",
                    `This course has no fixed meeting time, so attendance is measured by your activity in Canvas rather than by your presence in a room. You are counted present in a given week if you have submitted that week's work, posted to the discussion board, or otherwise engaged with the week's module by the Sunday deadline. Two consecutive weeks with no Canvas activity will trigger an outreach from me and may be reported to Student Success as a retention concern. Federal financial aid regulations also require that we document academically related activity.`
                  ],
                ].map(([label, text]) => (
                  <option key={label} value={text}>{label}</option>
                ))}
              </select>

              <A
                rows={8}
                value={d.attendance}
                onChange={(v) => set("attendance", v)}
                placeholder="Say what counts as present, what happens after an absence, and who to tell."
              />
            </Field> 
            <Field label="What engagement looks like here" hint="optional, but it removes a lot of guesswork"><A rows={3} value={d.participation} onChange={(v) => set("participation", v)} placeholder="Merely showing up and sitting through the class is not participation. Asking questions during Q and A, contributing to project discussions, and showing up to team meetings all count." /></Field>
            <Field label="Late work and make-up" hint="choose a sample, then edit as needed">
              <select value={d.lateSample} onChange={(e) => {
                const sample = LATE_POLICIES.find((policy) => policy.label === e.target.value);
                set("lateSample", e.target.value);
                set("late", sample?.text || "");
              }} style={{ ...inputBase, marginBottom: 8 }}>
                <option value="">Choose a sample policy...</option>
                {LATE_POLICIES.map((policy) => <option key={policy.label} value={policy.label}>{policy.label}</option>)}
              </select>
              <A rows={3} value={d.late} onChange={(v) => set("late", v)} placeholder="Describe your late work deadlines, penalties, extensions, and make-up arrangements." />
            </Field>
            {d.lateAdditional.map((policy, i) => (
              <Field key={i} label={`Additional policy`} hint="choose a sample, then edit as needed">
                <select value={policy.sample} onChange={(e) => {
                  const sample = LATE_POLICIES.find((option) => option.label === e.target.value);
                  setDeep("lateAdditional", i, "sample", e.target.value);
                  setDeep("lateAdditional", i, "text", sample?.text || "");
                }} style={{ ...inputBase, marginBottom: 8 }}>
                  <option value="">Choose a sample policy...</option>
                  {LATE_POLICIES.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
                </select>
                <A rows={3} value={policy.text} onChange={(v) => setDeep("lateAdditional", i, "text", v)} placeholder="Describe an additional late work or make-up arrangement." />
                <div className="flex justify-end mt-2">
                  <Btn onClick={() => drop("lateAdditional", i)} icon={Trash2}>Remove policy</Btn>
                </div>
              </Field>
            ))}
            <Btn onClick={() => push("lateAdditional", { sample: "", text: "" })} icon={Plus}>Add another policy</Btn>

            <div className="mt-6 mb-2" style={{ color: UI.navy, fontWeight: "bold", fontSize: 14 }}>Artificial Intelligence Policy</div>
            <Note>UTM's AI policy, effective July 1, 2025, requires every syllabus to state your expectations for student AI use. This is not optional, so pick a tier below. The three tiers match the policy: unrestricted, mixed, and total prohibition.</Note>
            {Object.entries(AI_POLICIES).map(([k, v]) => (
              <label key={k} className="flex items-start gap-2 mb-2 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="radio" name="ai" checked={d.aiTier === k} onChange={() => set("aiTier", k)} style={{ marginTop: 3 }} />
                <span>{v.label}</span>
              </label>
            ))}
            {d.aiTier === "custom" && <div className="mt-2"><A rows={7} value={d.aiCustom} onChange={(v) => set("aiCustom", v)}
              placeholder="Your policy must still affirm academic honesty and state that unpermitted AI use is academic misconduct under the Student Code of Conduct." /></div>}
            <div className="mt-4"><Field label="A note from your professor" hint="optional warm box, sits under the policy">
              <A rows={3} value={d.profNote} onChange={(v) => set("profNote", v)} placeholder="If you are ever unsure whether what you are submitting crosses that line, reach out before you submit. That conversation is always easier before the fact than after." /></Field></div>
            <div className="mt-6 mb-2" style={{ color: C.navy, fontWeight: "bold", fontSize: 14 }}>Additional Policies</div>
            {d.customPolicies.map((policy, i) => (
              <div key={i} className="mb-3 p-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <div className="flex items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Field label="Policy title"><T value={policy.title} onChange={(v) => setDeep("customPolicies", i, "title", v)} placeholder="Classroom conduct" /></Field>
                    <Field label="Policy details"><A rows={3} value={policy.text} onChange={(v) => setDeep("customPolicies", i, "text", v)} placeholder="Describe your expectations for students." /></Field>
                  </div>
                  <button type="button" onClick={() => drop("customPolicies", i)} aria-label={`Remove custom policy ${i + 1}`} title="Remove policy"
                    className="p-2 rounded" style={{ color: C.slate, background: "transparent", border: 0, cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <Btn onClick={() => push("customPolicies", { title: "", text: "" })} icon={Plus}>Add custom policy</Btn>
          </>)}

          {tab === 7 && (<>
            <H>University Policies</H>
            <Note>CTL maintains this language and checks it each term. Leave it checked and it stays current. If you edit it in Word after export, you own the accuracy of the edit.</Note>
            {Object.entries(LOCKED).map(([k, v]) => (
              <div key={k} className="mb-3 p-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={d.inc[k]} onChange={(e) => set("inc", { ...d.inc, [k]: e.target.checked })} />
                  <Lock size={12} style={{ color: C.orange }} />
                  <span style={{ color: UI.navy, fontWeight: "bold", fontSize: 13.5 }}>{v.title}</span>
                </label>
                <div style={{ fontSize: 12, color: C.slate, marginTop: 6, lineHeight: 1.5, maxHeight: 86, overflow: "auto", whiteSpace: "pre-wrap" }}>{v.text}</div>
              </div>
            ))}
          </>)}

          {tab === 8 && (<>
            <H>Schedule</H>
            <Field label="Schedule format">
              <select style={inputBase} value={d.scheduleType || "weekly"} onChange={(e) => {
                const next = e.target.value;
                setD((p) => ({ ...p, scheduleType: next, weeks: p.weeks.map((w) => ({
                  ...w,
                  label: /^(Week|Module) \d+$/.test(w.label)
                    ? w.label.replace(/^(Week|Module)/, next === "modular" ? "Module" : "Week") : w.label,
                })) }));
              }}>
                <option value="weekly">Weekly</option>
                <option value="modular">Modular</option>
              </select>
            </Field>
            <Field label="Class meets on" hint={cal ? `dates come from the ${d.term} registrar calendar` : "pick a term on the Course tab to use the registrar calendar"}>
              <div className="flex flex-wrap gap-1">
                {CLASS_DAYS.map(([n, name]) => {
                  const on = d.meetDays.includes(n);
                  return (
                    <button key={n} type="button" aria-pressed={on} aria-label={DAY_NAMES[n]} onClick={() => toggleDay(n)}
                      style={{ fontSize: 13, padding: "5px 12px", borderRadius: 14, cursor: "pointer", fontWeight: on ? "bold" : "normal",
                        border: `1px solid ${on ? C.orange : C.line}`, background: on ? C.orange : "#fff", color: on ? "#fff" : C.slate }}>
                      {name}
                    </button>
                  );
                })}
              </div>
            </Field>
            {auto ? (
              <Note>Weeks and dates are built from the days you picked. Holidays that fall on those days are marked "No class." Fill in topics and due dates below.</Note>
            ) : (
              <>
                <Note>Choose the first day of classes and the builder will fill each week's Monday-to-Friday date range automatically. You can still edit any individual week afterward.</Note>
                <div className="flex gap-2 items-end flex-wrap mb-4">
                  <div style={{ minWidth: 220 }}>
                    <Lbl hint="used for automatic week dates">Semester start</Lbl>
                    <T type="date" value={d.semesterStart} onChange={(v) => set("semesterStart", v)} />
                  </div>
                  <Btn onClick={autofillScheduleDates} icon={CalendarDays}>Autofill dates</Btn>
                  {d.scheduleType !== "modular" && (
                    <Btn onClick={buildSemesterSchedule} icon={CalendarDays}>Build 15 weeks with dates</Btn>
                  )}
                </div>
              </>
            )}
            {d.term === "Fall 2026" ? (
              <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="checkbox" checked={d.calNote} onChange={(e) => set("calNote", e.target.checked)} style={{ marginTop: 3 }} />
                <span>Append the Fall 2026 registrar dates: add and drop deadlines, Fall Break, Thanksgiving, finals, and commencement.</span>
              </label>
            ) : (
              <Note>The built-in add/drop and deadline table is currently available only for Fall 2026, so it will not be appended for this semester.</Note>
            )}
            {schedRows.map((w, i) => (
              <div key={i} className="p-3 mb-3 rounded" style={{ background: UI.paper, border: `1px solid ${UI.line}` }}>
                {auto ? (
                  <div className="mb-2">
                    <span style={{ color: C.navy, fontWeight: "bold", fontSize: 14 }}>{w.label}</span>
                    <span style={{ color: C.slate, fontSize: 13, marginLeft: 8 }}>{w.dates}</span>
                    {w.off.map((o) => <div key={o} style={{ color: C.warn, fontSize: 12.5, fontWeight: "bold", marginTop: 2 }}>{o}</div>)}
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <div style={{ flex: 1 }}><T value={w.label} onChange={(v) => setDeep("weeks", i, "label", v)} placeholder={d.scheduleType === "modular" ? `Module ${i + 1}` : `Week ${i + 1}`} /></div>
                    <div style={{ flex: 2 }}><T value={w.dates} onChange={(v) => setDeep("weeks", i, "dates", v)} placeholder={d.scheduleType === "modular" ? "Module dates (optional)" : "August 24 to 28"} /></div>
                    <button onClick={() => drop("weeks", i)} style={{ color: UI.muted, cursor: "pointer" }}><Trash2 size={15} /></button>
                  </div>
                )}
                <div className="flex gap-2">
                  <div style={{ flex: 2 }}><A rows={3} value={w.topics} onChange={(v) => setWeek(i, "topics", v)} placeholder="Topic and readings" /></div>
                  <div style={{ flex: 1 }}><A rows={3} value={w.due} onChange={(v) => setWeek(i, "due", v)} placeholder="Due" /></div>
                </div>
              </div>
            ))}
            {!auto && (<div className="flex gap-2 flex-wrap items-start">
              <Btn onClick={() => {
                const i = d.weeks.length;
                const dates = buildWeekDates(d.semesterStart, i + 1);
                push("weeks", { label: `${d.scheduleType === "modular" ? "Module" : "Week"} ${i + 1}`, dates: dates[i] || "", topics: "", due: "" });
              }} icon={Plus}>Add {d.scheduleType === "modular" ? "module" : "week"}</Btn>
              <div style={{ flex: "0 0 250px" }}>
                <div className="flex gap-2">
                  <input //text box
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label={`Number of ${d.scheduleType === "modular" ? "modules" : "weeks"}`}
                    aria-invalid={weekCountWarning}
                    placeholder="1-15"
                    style={{ ...inputBase, width: 110 }}
                    value={weekCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^[0-9]*$/.test(value)) {
                        setWeekCountWarning(true);
                        return;
                      }
                      setWeekCount(value);
                      setWeekCountWarning(!value || Number(value) < 1 || Number(value) > 15);
                    }}
                  />
                  <Btn onClick={() => {
                    const count = Number(weekCount); // builds the number of weeks input
                    if (!/^[0-9]+$/.test(weekCount) || count < 1 || count > 15) {
                      setWeekCountWarning(true);
                      return;
                    }
                    setWeekCountWarning(false); 
                    setD((p) => ({
                      ...p,
                      weeks: Array.from({ length: count }, (_, i) => p.weeks[i] || {
                        label: `${p.scheduleType === "modular" ? "Module" : "Week"} ${i + 1}`,
                        dates: "",
                        topics: "",
                        due: "",
                      }),
                    }));
                  }}>{d.scheduleType === "modular" ? "Build modules" : "Build weeks"}</Btn>
                </div>
                <div role="alert" className="mt-1 text-xs" style={{ color: C.warn, minHeight: 32 }}>
                  {weekCountWarning ? "Enter a whole number between 1-15." : ""/* displays a warning if the week count is invalid */}
                </div>
              </div>
            </div>)}
          </>)}

                    {tab === 9 && (<>
            <H>Laboratory Component</H>
            <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
              <input type="checkbox" checked={d.hasLab} onChange={(e) => set("hasLab", e.target.checked)} style={{ marginTop: 3 }} />
              <span>This course has a lab component. Checking this adds a Laboratory Component section to the syllabus.</span>
            </label>
            {d.hasLab && (<>
              <Note>Students often ask three things about a lab: does it count toward my course grade, what happens if I miss one, and what do I need to bring. Answering those here saves you the emails.</Note>
              <div className="flex gap-3 flex-wrap">
                <div style={{ flex: "1 1 130px" }}><Field label="Lab section / CRN"><T value={d.lab.crn} onChange={(v) => setLab("crn", v)} placeholder="12346" /></Field></div>
                <div style={{ flex: "2 1 220px" }}><Field label="Lab instructor" hint="if different from you"><T value={d.lab.instructor} onChange={(v) => setLab("instructor", v)} /></Field></div>
              </div>
              <Field label="Lab meeting time"><T value={d.lab.meeting} onChange={(v) => setLab("meeting", v)} placeholder="Wednesday, 2:00 to 4:50 p.m." /></Field>
              <Field label="Lab location"><T value={d.lab.location} onChange={(v) => setLab("location", v)} placeholder="Science Complex 118" /></Field>
              <Field label="What happens in lab" hint="how it connects to lecture"><A rows={3} value={d.lab.description} onChange={(v) => setLab("description", v)} /></Field>
              <Field label="How the lab counts toward the course grade" hint="separate grade, percent of the total, or must pass both"><A rows={3} value={d.lab.gradeNote} onChange={(v) => setLab("gradeNote", v)} placeholder="Lab is 25 percent of your final grade. Lab reports are graded within one week." /></Field>
              <Field label="Lab attendance"><A rows={3} value={d.lab.attendance} onChange={(v) => setLab("attendance", v)} /></Field>
              <Field label="Lab safety" hint="required"><A rows={4} value={d.lab.safety} onChange={(v) => setLab("safety", v)} placeholder="Your safety rules, any training students must complete before the first lab, and what happens if the rules are not followed." /></Field>
              <Field label="Supplies and protective equipment"><A rows={3} value={d.lab.supplies} onChange={(v) => setLab("supplies", v)} placeholder="Lab notebook, closed-toe shoes, goggles (available at the bookstore)." /></Field>
              <Field label="Missed labs and make-up"><A rows={3} value={d.lab.makeup} onChange={(v) => setLab("makeup", v)} /></Field>
            </>)}
          </>)}


          {tab === 10 && (<>
            <H>Review and Export</H>
            <div className="mb-5">
              {checks.map(([label, ok]) => (
                <div key={label} className="flex items-start gap-2 py-1" style={{ fontSize: 13.5, color: ok ? C.ink : C.warn }}>
                  {ok ? <Check size={15} style={{ color: C.good, flexShrink: 0, marginTop: 2 }} />
                      : <AlertTriangle size={15} style={{ color: C.warn, flexShrink: 0, marginTop: 2 }} />}
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <Note>Nothing here is stored anywhere. Closing this tab clears it. Export your syllabus to Word or PDF before closing.</Note>
            <div className="flex flex-wrap gap-2 mb-4">
              <Btn onClick={() => confirmThenExport(exportWord)} icon={FileDown} primary>Export to Word</Btn>
              <Btn onClick={() => confirmThenExport(exportPdf)} icon={Printer} primary>Export to PDF</Btn>
              <Btn onClick={clearForm} icon={Trash2}>Clear form</Btn>
            </div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 14, lineHeight: 1.55 }}>
              Word opens the export as a normal document you can keep editing. PDF opens your browser's print dialog, where you choose Save as PDF. Both come out in Cambria with the UT Martin banner and real Word heading styles, so a screen reader can navigate it.
            </div>
          </>)}
        </div>

        {/* preview */}
        <div className={previewFullscreen ? "" : "p-5"} style={previewFullscreen
          ? { position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", background: C.wash }
          : { flex: "1 1 460px", minWidth: 360 }}>
          <div className="flex items-center justify-between gap-3 mb-2" style={{
            color: C.slate, fontSize: 12, letterSpacing: 1,
            ...(previewFullscreen ? { background: "#fff", borderBottom: `1px solid ${C.line}`, padding: "12px 20px", marginBottom: 0 } : {}),
          }}>
            <div className="flex items-center gap-2">
              <ChevronRight size={13} style={{ color: C.orange }} />THIS IS EXACTLY WHAT EXPORTS
            </div>
            <button
              type="button"
              onClick={() => setPreviewFullscreen((fullscreen) => !fullscreen)}
              aria-label={previewFullscreen ? "Exit fullscreen preview" : "Open fullscreen preview"}
              aria-pressed={previewFullscreen}
              title={previewFullscreen ? "Exit fullscreen (Esc)" : "Open fullscreen preview"}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold"
              style={{ background: "#fff", color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer", letterSpacing: 0 }}
            >
              {previewFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              {previewFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
          <div style={previewFullscreen
            ? { flex: 1, minHeight: 0, overflow: "auto", padding: "24px clamp(16px, 5vw, 72px)" }
            : {}}>
            <div ref={previewRef} style={{
              background: "#fff", border: `1px solid ${C.line}`, borderRadius: 3, boxSizing: "border-box",
              width: "8.5in", maxWidth: "100%", padding: "0.8in",
              maxHeight: previewFullscreen ? "none" : "calc(100vh - 130px)", overflow: previewFullscreen ? "visible" : "auto",
              boxShadow: "0 1px 4px rgba(11,34,64,.08)",
              ...(previewFullscreen ? { maxWidth: 1100, minHeight: "100%", margin: "0 auto" } : {}),
            }}>
              <style>{DOC_CSS}</style>
              <div dangerouslySetInnerHTML={{ __html: docBody || `<p class="soft">Start on the left. The document builds itself here.</p>` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Renders the orange-underlined heading used at the top of each editor section. */
function H({ children }) {
  return <div style={{ color: UI.navy, fontWeight: "bold", fontSize: 17, marginBottom: 12,
    borderBottom: `2px solid ${C.orange}`, paddingBottom: 6, display: "inline-block" }}>{children}</div>;
}