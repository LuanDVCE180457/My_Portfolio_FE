import type { Project } from '../types/project';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const techStack = project.techStack ?? [];

  return (
    <article className="project-card">
      <img
        src={project.imageUrl || 'https://placehold.co/640x420?text=Project'}
        alt={project.title}
        className="project-card__image"
      />
      <div className="project-card__body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="project-card__tags">
          {techStack.map((tech) => (
            <span key={tech} className="project-card__tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-card__actions">
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noreferrer">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}