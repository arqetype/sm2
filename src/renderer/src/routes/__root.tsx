import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Devtools } from '@/providers/devtools';
import { AppTitlebar } from '@/components/titlebar/app-titlebar';
import { createTabStore } from '@/store/tabs';
import { TabsProvider } from '@/providers/tabs-provider';
import { TabsRoot } from '@/components/navigation/tabs-root';
import { AppCommandMenu } from '@/components/command-menu/app-command-menu';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

const TempComponent = () => {
  return (
    <div>
      <p className="p-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed commodo odio, eget
        hendrerit nisi. Integer massa dui, faucibus ac lobortis ac, sagittis quis velit. Fusce
        suscipit sagittis lacus at ultricies. Mauris eleifend rutrum massa eget tempor. Vivamus sed
        erat sit amet risus ullamcorper congue. Fusce convallis placerat orci sed maximus. Nulla
        imperdiet nulla eros, quis accumsan odio rutrum eget. Suspendisse tellus ex, imperdiet ut
        arcu et, hendrerit tincidunt arcu. Integer iaculis eu purus dictum tempor. Proin interdum
        pretium ex eget blandit. Aliquam pellentesque lacus eu sem commodo, quis tincidunt neque
        pulvinar. Nam sed libero laoreet, malesuada turpis a, mattis turpis. Etiam eu pulvinar
        tellus, eu viverra arcu. Vestibulum malesuada consequat tellus ac suscipit. Mauris
        dignissim, erat sit amet vehicula consequat, nulla massa facilisis risus, sit amet tincidunt
        nunc dui non purus. Aenean ultrices tellus ullamcorper, dignissim quam in, congue nulla.
        Vestibulum ac elementum turpis. Curabitur sed lacus vitae odio sollicitudin mattis quis eget
        odio. Duis bibendum risus libero, a imperdiet tortor tristique pharetra. Nulla turpis felis,
        lobortis at tempus vel, consectetur a risus. Praesent eget velit tristique, dictum nibh nec,
        egestas orci. Quisque mi risus, lobortis nec nisl id, ullamcorper condimentum lacus. Fusce
        sit amet porta massa, ac malesuada velit. Proin feugiat nisi nec mauris rutrum hendrerit.
        Aliquam erat volutpat. Donec pellentesque tempus consectetur. Nam sit amet imperdiet velit.
        Maecenas condimentum ex vel lorem pharetra faucibus. Nunc tempus enim ut velit consequat
        condimentum. Etiam quis rhoncus ipsum, eget fermentum felis. Nam aliquet pellentesque ipsum,
        convallis interdum turpis interdum quis. Mauris nec lacus ac magna sollicitudin eleifend.
        Mauris sed ex ac enim laoreet aliquam sed in odio. Nullam in elit vel orci pellentesque
        viverra at a quam. Aliquam eu arcu et risus tristique placerat nec non nulla. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Nulla tempor metus id dolor porttitor, vitae
        efficitur purus cursus. Morbi ut ornare diam. Duis eget auctor lorem, in gravida justo.
        Fusce velit neque, accumsan in mollis sit amet, maximus ac est. Aliquam iaculis quis velit
        eget varius. Donec enim risus, commodo ac metus et, vehicula dictum purus. Proin pretium
        magna a velit sagittis, ac lobortis felis pulvinar. Cras tempus, lectus in semper pharetra,
        erat magna interdum erat, eget aliquet justo augue at augue. Vestibulum ut vulputate eros.
        Ut non blandit dui. Integer et dui tincidunt magna pretium pulvinar et non lectus. Vivamus
        rhoncus ac odio eu pellentesque. Praesent dui dolor, dictum ac risus sed, posuere blandit
        elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Fusce blandit eros enim, ut iaculis neque scelerisque eget. Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rhoncus
        dui fermentum arcu tempus consectetur vel sed elit. Phasellus fermentum justo in dapibus
        suscipit. Phasellus sit amet sollicitudin diam, id feugiat nisi. Curabitur eu erat a elit
        efficitur pretium. Morbi molestie quam id augue condimentum, eget tempus mi finibus. Duis at
        faucibus lectus. Proin accumsan ornare iaculis. Vestibulum maximus iaculis eros in blandit.
        Aenean consequat justo vel massa rutrum interdum. Duis dolor ante, tempus pellentesque
        consectetur et, ultricies eget turpis. Curabitur convallis nulla a faucibus venenatis.
        Praesent et purus at sapien egestas elementum. Nunc bibendum dapibus augue, at consectetur
        nulla condimentum in. In vehicula eu arcu in iaculis. Vivamus ultrices ultrices dolor eu
        aliquet. Quisque interdum tortor eu purus semper malesuada. Nullam eu ex non neque convallis
        pharetra id a elit. Nam viverra turpis egestas augue condimentum, et feugiat sapien
        fermentum. Integer ultrices urna non lacus feugiat, ac euismod orci mattis. Aliquam eget est
        lorem. Quisque posuere dictum nulla sit amet blandit. Suspendisse vulputate ipsum dui,
        molestie condimentum neque mattis ut. Vestibulum id fermentum purus. Donec sed ultricies
        nisl. Cras sollicitudin nulla eget enim elementum faucibus. Phasellus eu vestibulum arcu,
        quis tempus nulla. Vestibulum et molestie ligula. Morbi viverra vel sapien nec euismod. Nunc
        at cursus tellus, eu porttitor orci. Donec augue leo, convallis id ex quis, molestie
        scelerisque enim. Mauris quam enim, congue in est ac, convallis eleifend mi. Sed varius,
        quam tincidunt sodales vulputate, lectus orci pellentesque dolor, eu ullamcorper odio nulla
        lobortis sem. Fusce id dui nec sapien aliquet pretium id vel neque. Curabitur dignissim
        massa in pharetra sodales. Aliquam gravida eget turpis a egestas. Integer suscipit metus non
        elit posuere, id fermentum massa lacinia. Sed viverra lectus quis rutrum sagittis. Cras
        tristique, ante vitae aliquet vehicula, sapien orci malesuada libero, eu facilisis mi nulla
        nec mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus
        mus. Integer sed orci nisi. Aliquam ornare ornare libero, eu vulputate neque consequat in.
        Pellentesque nec mi et velit finibus ullamcorper. Nullam mattis, purus in tristique ornare,
        elit leo ornare eros, vitae dictum augue magna eget metus. Pellentesque in ex porttitor
        lorem aliquet fermentum. Vestibulum lacinia, nunc non sodales tincidunt, ligula orci
        fringilla leo, at tempus massa lorem vel diam. Duis interdum pellentesque felis nec ornare.
        Mauris sit amet augue a metus sollicitudin pharetra et eu diam. Duis sit amet lacinia orci.
        Donec lectus justo, pretium sed tortor in, pellentesque condimentum erat. Suspendisse justo
        lacus, condimentum at tincidunt in, varius quis diam. Maecenas sagittis placerat turpis et
        molestie. Nullam ac ornare est. Cras et lectus tempus, ullamcorper erat vel, auctor purus.
        Cras gravida nunc eget augue mattis blandit vel ullamcorper dui. Sed pharetra ultrices
        consequat. Morbi pulvinar ligula tortor, sit amet finibus eros dictum et. Nunc mollis ipsum
        lorem, ac consectetur magna finibus at. Sed et neque ut mi tempor tincidunt. Nunc ut tempus
        dui. Nulla luctus est non augue auctor tempor. Nunc egestas purus augue, ac volutpat nibh
        euismod id. Donec feugiat, diam vitae rutrum tempus, ante lectus sagittis ligula, id
        fringilla lorem nisi sed ligula. Donec scelerisque ornare quam, at sollicitudin arcu egestas
        sit amet. In nec lacus vel nunc molestie pretium. Nam erat turpis, porttitor ut ultrices ac,
        cursus in purus. Suspendisse tincidunt dui convallis, tristique justo vitae, mollis velit.
        Donec commodo convallis rutrum. Sed commodo imperdiet lectus, sodales ultrices mi ultrices
        ut. Curabitur ut dolor vitae felis convallis lobortis. Vestibulum ante ipsum primis in
        faucibus orci luctus et ultrices posuere cubilia curae; Mauris pellentesque lobortis leo ac
        pharetra. Vivamus eu blandit orci. Aliquam a lorem sit amet est finibus dapibus id sed
        justo. Phasellus ullamcorper semper gravida. Aliquam ac erat vel nulla viverra rhoncus.
        Aenean lobortis nec lacus ac ultricies. Interdum et malesuada fames ac ante ipsum primis in
        faucibus. Nulla finibus, mauris et imperdiet dignissim, arcu augue lacinia nibh, ut porta
        est purus non nisl. Suspendisse id massa eget nisl sagittis condimentum. Ut condimentum leo
        arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
        curae; Phasellus vel augue et ipsum condimentum efficitur. Curabitur accumsan est at arcu
        mattis, a hendrerit libero mollis. Proin vestibulum at metus posuere semper. Vestibulum
        iaculis justo sed ullamcorper ultrices. In nec placerat dolor, sed rhoncus tellus. In
        accumsan pharetra facilisis. Vivamus fringilla sapien sed quam elementum, ut semper metus
        egestas. Curabitur pellentesque tempor quam ac mollis. Donec fermentum ante dui. Sed sed
        sapien elit. Vestibulum urna felis, sagittis sit amet augue sit amet, vulputate ullamcorper
        lorem. Sed varius nec velit non placerat. Donec sit amet dapibus ex. Etiam et mauris at
        velit tristique vehicula. Integer pulvinar velit eget elit suscipit, et elementum lacus
        finibus. Integer commodo ligula nec tortor blandit malesuada. Etiam luctus sagittis sem a
        maximus. Suspendisse pretium metus in neque consectetur blandit. Integer ornare accumsan
        fermentum. Cras sodales venenatis lectus. Aliquam a nisi nec lectus euismod pretium at non
        erat. Sed massa urna, tempus vel cursus id, gravida bibendum odio. Maecenas tempor pretium
        ante non rutrum. Nullam eget est augue. Vestibulum mattis justo eget dolor porttitor, in
        porttitor est volutpat. Cras sem risus, maximus eu turpis sed, semper elementum ligula. Nam
        vestibulum tincidunt turpis at tincidunt. Integer quis eros eget mauris volutpat dapibus.
        Sed luctus sollicitudin cursus. Proin cursus lorem id tincidunt vestibulum. Etiam aliquam
        velit in orci mollis, a tempor neque molestie. Mauris eu ullamcorper massa. Etiam mattis
        rhoncus viverra. Cras at tincidunt eros, vel bibendum tortor. Nam orci massa, vehicula eu
        vulputate placerat, rutrum mattis lorem. Maecenas ut rutrum felis. Vestibulum enim leo,
        vehicula eu dapibus in, fermentum ut mi. Aenean augue est, fringilla a risus sit amet,
        pellentesque pellentesque tortor. Donec ac risus vel nisi efficitur euismod nec et orci. Ut
        posuere consectetur enim, vitae viverra augue maximus non. Phasellus nec ex tempor, feugiat
        ante id, semper ligula.
      </p>
    </div>
  );
};

function RootComponent() {
  const useBrowserTabs = createTabStore({
    initialTabs: [
      { id: 'welcome', title: 'Welcome', component: TempComponent },
      { id: 'features', title: 'Features', component: TempComponent }
    ]
  });

  return (
    <main>
      <SidebarProvider ignoreMobile={true}>
        <TabsProvider useStore={useBrowserTabs}>
          <AppSidebar />
          <TabsRoot>
            <AppTitlebar />
            <div className="w-full pt-10 h-full">
              <Outlet />
            </div>
            <Devtools />
          </TabsRoot>
          <AppCommandMenu />
        </TabsProvider>
      </SidebarProvider>
    </main>
  );
}

function NotFoundComponent() {
  return <p>What are you even looking for</p>;
}
