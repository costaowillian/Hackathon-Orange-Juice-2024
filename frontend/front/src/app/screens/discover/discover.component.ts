import { IProject } from "src/app/models/iProject";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs";
import { DiscoverService } from "./service/discover.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.component.html",
  styleUrls: ["./discover.component.scss"],
})
export class DiscoverComponent implements OnInit {
  searchForm = this.formBuilder.group({
    search: [""],
  });

  userImg: string = 'assets/imgs/img_profile_orange_portfolio.png'

  //controle de mensagem de pesquisa
  searchResultEmpty: boolean = false;

  //controle de dados pesquisados
  searchProjects: IProject[] = [];

  //Array para projetos
  projects: IProject[] = [];
  
  tags: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private discoverService: DiscoverService) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.searchForm
      .get("search")
      ?.valueChanges.pipe(
        map((value) => value!.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(async (value) => {
          this.handleSearch(value);
        })
      )
      .subscribe();
  }

  getAllProjects() {
    this.discoverService.getProjectsDiscover().subscribe({
      next: (projects: IProject[]) => {
        projects.forEach(projectData => {
          const project: IProject = {
            id: projectData.id,
            title: projectData.title,
            tags: projectData.tags,
            link: projectData.link,
            description: projectData.description,
            img: projectData.img,
            firstName: projectData.firstName,
            lastName: projectData.lastName,
            releaseDate: projectData.releaseDate
          }
          this.projects.push(project);
        })
      },
      error: (error) => {
        console.error("Erro ao recuperar projetos:", error);
      },
    });
    console.log(this.projects);
  }

  handleSearch(value: string) {
    this.searchProjects = this.projects.filter((project) => {
      return project.tags && project.tags.some((tag) => tag.startsWith(value));
    });
    this.searchResultEmpty = this.searchProjects.length === 0;
  }

}
